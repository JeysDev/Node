<<template>
    <div>
    <v-row>
        <v-col cols="12" class="text-center">
            <v-icon class="mt-n3 mr-1">mdi-account-group</v-icon>
            <span>This is Department Page</span>
        </v-col>
        <v-col :cols="$vuetify.display.smAndDown ? 12 : 10">
            <v-text-field
                v-model="searchDept"
                hide-details
                placeholder="Search"
                prepend-inner-icon="mdi-magnify"
            />
        </v-col>
        <v-col :cols="$vuetify.display.smAndDown ? 12 : 2">
            <v-btn @click="openEmpD('Add',{})" 
            block 
            color="green" 
            >Add</v-btn>
        </v-col>
        <v-col :cols="12">
            <v-card>
                <v-table height="calc(100vh -250px)">
                    <thead>
                        <tr style="background-color:green; 
                        color:azure;
                        font-size:16px;
                        font-style:oblique;">
                        <th v-for="(header, index) in employeeHeader" :key="index">{{ header.title }}</th>
                        <th>Actions</th>
                            <!-- <th>Employee Code</th>
                            <th>Employee Name</th>
                            <th>Department Name</th>
                            <th>Section Name</th>
                            <th>Team Name</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr  v-for="(item,index) in SearchFunction" :key="index" :style="{ backgroundColor: item.deleted_at ? '#EF5350' : '' }" >
                            <td v-for="(header, i) in employeeHeader" :key="i" >{{ item[header.model] }}</td>
                        <td class="d-flex align-center ga-1">
                            <template v-if="!item.deleted_at">
                                <v-btn
                                    icon
                                    size="small"
                                    class="hover"
                                    color="primary"
                                    @click="openEmpD('Edit',item)" >
                                    <v-icon size="x-large">mdi-pen </v-icon>
                                </v-btn>
                                <v-btn 
                                    icon
                                    size="small"
                                    color="red"
                                    class="hover"
                                    @click="deleteEmployee(item)" >
                                    <v-icon size="x-large">mdi-delete </v-icon>
                                </v-btn>     
                        </template>
                            <template v-else>
                                <v-btn 
                                    size="small"
                                    color="warning"
                                    class="hover"
                                    icon
                                    @click="restoreEmployee(item)" >
                                    <v-icon size="x-large">mdi-refresh </v-icon>
                                </v-btn>
                            </template>                        
                        </td>
                            <!-- <td>{{ item.employee_code }}</td>
                            <td>{{ item.employee_name }}</td>
                            <td>{{ item.department_code }}</td>
                            <td>{{ item.section_code }}</td>
                            <td>{{ item.team_code }}</td> -->
                        </tr>
                    </tbody>
                </v-table> 
            </v-card>
        </v-col>
    </v-row>
    <v-dialog persistent scrollable width="450px" v-model="employeeDialog">
        <v-card>
        <div class="bg-green d-flex justify-space-between">
            <v-card-title >{{ statusMode }} Employee </v-card-title> 
            <span>
                <v-btn 
                    @click="employeeDialog = !employeeDialog" 
                    class="bg-red mt-1 mr-2">
                    <v-icon>mdi-close</v-icon>
                </v-btn >
            </span>
        </div>
            <v-card-text class="pa-3">
                <br>
                <v-form ref="form">
                    <div v-for="(item , index) in employeeHeader" :key="index">
                        <v-text-field
                            class="mb-1"
                            :label="item.title"
                            :rules="[v => !!v || item.title + ' is required']"
                            v-model="employeeObj[item.model]"
                        ></v-text-field>
                    </div>
                </v-form>
                <!-- <v-text-field placeholder="Employee Code"/>
                <v-text-field placeholder="Employee Name"/>
                <v-text-field placeholder="Department Code"/>
                <v-text-field placeholder="Section Code"/>
                <v-text-field placeholder="Team Code"/> -->
            </v-card-text>
            <v-card-actions>
                <v-btn 
                @click="employeeDialog = !employeeDialog" 
                    variant="tonal" 
                    color="error"> 
                    Cancel
                </v-btn>
                <v-btn
                @click="insertEmployee()"
                    variant="tonal" 
                    color="success">
                   {{ statusMode }} 
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>
import axios from 'axios'; // Import the axios library
    export default {
        data(){
            return {
                searchDept:'',
                statusMode: '', // dito ilalagay yung status mode
                departmentObj: {}, // dito ilalagay yung na save sa database
                departmentData: [], // dito ilalagay yung na fetch sa database
                SearchButton: false,
                departmentDialog: false, // Dialog visibility
                departmentHeader:[ // dito ilalagay yung header ng employee
                    {title: 'Department Code', model: 'department_code'},
                    {title: 'Department Name', model: 'department_name'},
                    {title: 'Section Code', model: 'section_code'},
                    {title: 'Team Code', model: 'team_code'},    
                ]
            }
        },
        computed:{
            SearchFunction(){
                // const filter = this.searchEmpl?.toLowerCase();
                // if (filter && this.SearchButton){
                    return this.employeeData.filter((item) => {
                        return item.employee_code.includes(this.searchEmpl)
                        || item.employee_name.toLowerCase().includes(this.searchEmpl.toLowerCase())
                        || item.department_code.toLowerCase().includes(this.searchEmpl.toLowerCase())
                        || item.section_code.toLowerCase().includes(this.searchEmpl.toLowerCase())
                        || item.team_code.toLowerCase().includes(this.searchEmpl.toLowerCase())
                    })
                // }
                // else{
                //     this.SearchButton = false;
                // }
            }
        },
        mounted() { // pag nag load yung page
            this.getEmployees(); // call yung function para mag fetch ng data sa database
        },
        methods:{ // dito ilalagay yung function para mag save at mag fetch ng data sa database
            async getEmployees(){ // function para mag fetch ng data sa database
                const api ='http://localhost:3000/api/employees'; // url ng api
               //promise
                // fetch(api, {
                //     method: 'get'
                // })
                // .then((res)=> {
                //     return res.json();
                // })
                // .then((data)=> {
                //     console.log(data);
                //     this.employeeData = data.data
                // })
                // .catch((err)=>{
                //     console.error("Error fetching data: " + arr);
                //     alert(err)
                // });

                //Async await 
                // try{
                //     const res =await fetch(api,{method:'get'});
                //     const data = await res.json();
                //     console.log(data);
                //     this.employeeData = data.data
                // } catch(err){
                //     console.error("Error fetching data: " + err);;
                //     alert(err);
                // }

                //Axios
                // axios.get(api).then((res)=>{
                //     console.log(res.data);
                //     this.employeeData = res.data.data
                // }).catch((err)=>{
                //     console.error("Error fetching data: " + err);
                //     alert(err);
                // })

                //Axios Async Await
                try{
                    const res =await axios.get(api); //inakses yung api
                    console.log(res.data); // inakses yung data at dinisplay sa console
                    this.employeeData = res.data.data; // ipinasa yung data sa employeeData na array
                } catch (err){
                    console.error("Error fetching data: " + err);
                    alert(err);
                };
            },
            async insertEmployee(){ // function para mag save ng data sa database
                    const api ='http://localhost:3000/api/employees'
                    const{valid } = await this.$refs.form.validate(); // valid yung form
                    if(valid) {
                    // try{
                        // let res;
                        // if(this.statusMode ==='Add'){
                        //      res = await axios.post(api,
                        //         this.employeeObj
                        //     )
                        // }else{
                        //     const res = await axios.put(api,
                        //         this.employeeObj
                        //     )
                        // }
                        // alert(res.data.message);
                        // this.getEmployees();
                        // this.employeeDialog=false;
                    // } catch (err){
                    //     console.error("Error saving data: " + err);
                    //     alert(err.response.data.message);
                    // }
                        axios ({
                            method: this.statusMode === 'Add' ? 'post' : 'put' || 'delete',
                               url: api,
                               data: this.employeeObj
                        })
                        .then((res)=>{
                            this.employeeDialog =false;
                            alert(res.data.message);
                            this.getEmployees();
                        })
                        .catch((err)=>{
                            console.error("Error saving data: " + err);
                            alert(err.response.data.message)
                        })
                        }
            },
            deleteEmployee(item){ // function para mag delete ng data sa database
                const api =  `http://localhost:3000/api/employees`;
                if (confirm(`Are you sure you want to delete ${item.employee_code}?`)){
                    axios ({
                        method: 'delete',
                        url:api,
                        data: item
                    })
                    .then((res)=>{
                        alert(res.data.message);
                        this.getEmployees();
                    })
                    .catch((err)=>{
                        console.error("Error saving data: " + err);
                        alert(err.response.data.message)
                    })
                }
            },
            restoreEmployee(item){
                const api =`http://localhost:3000/api/employees`;
                axios ({
                    method: 'patch',
                    url: api,
                    data: item
                })
                .then((res)=>{
                    alert(res.data.message);
                    this.getEmployees();
                })
                .catch((err)=>{
                    console.error("Error saving data: " + err);
                    alert(err.response.data.message)
                })
            },
            openEmpD(action,item){ // function para mag open ng employee details
                this.statusMode = action;
                this.employeeDialog= true;

                if(action === 'Add'){
                    this.employeeObj ={};
                }else {
                    this.employeeObj = {...item};
                }
            }
        },
    };
</script>

<style scoped>

</style>


