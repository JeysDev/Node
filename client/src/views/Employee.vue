<template>
    <div>
    <v-row>
        <v-col cols="12" class="text-center">
            <v-icon class="mt-n3 mr-1">mdi-account-group</v-icon>
            <span>This is Employee Page</span>
        </v-col>
        <v-col :cols="$vuetify.display.smAndDown ? 12 : 10">
            <v-text-field
                v-model="searchEmpl"
                hide-details
                placeholder="Search"
                prepend-inner-icon="mdi-magnify"
                style="color:orange"
            />
        </v-col>
        <v-col :cols="$vuetify.display.smAndDown ? 12 : 2">
            <v-btn @click="openEmpD('Add',{})" 
            block 
            color="orange" 
            >Add</v-btn>
        </v-col>
        <v-col :cols="12">
            <v-card>
                <v-table height="calc(100vh -250px)" theme="dark">
                    <thead>
                        <tr style="background-color:orange; 
                        color:Black;
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
                        <tr style="color:orange" v-for="(item,index) in SearchFunction" :key="index" :style="{ backgroundColor: item.deleted_at  ? 'red' : '' }">
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
        <v-card style="background-color:black;">
        <div class="bg-orange d-flex justify-space-between">
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
                    <div style="color:orange" v-for="(item , index) in employeeHeader" :key="index">
                        <v-text-field
                            
                            class="mb-1"
                            :label="item.title"
                            :rules="[v => !!v || item.title + ' is required']"
                            v-model="employeeObj[item.model]"
                            v-if="
                            item.title !== 'Department Code' && 
                            item.title !== 'Section Code' &&
                            item.title !== 'Team Code'"/>
                            <v-autocomplete 
                                v-else
                                :label="item.title"
                                :rules="[v=> !!v || item.title + ' is required']" v-model="employeeObj[item.model]"
                                :items="item.item"/>
                    </div>
                </v-form>
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
import {computed} from 'vue';
import {useStore} from '@/stores/store';
import axios from 'axios'; // Import the axios library
import { mapActions, mapState } from 'pinia';
    export default {
        data(){
            return {
                searchEmpl:'',
                statusMode: '', // dito ilalagay yung status mode
                employeeObj: {}, // dito ilalagay yung na save sa database
                employeeData: [], // dito ilalagay yung na fetch sa database
                SearchButton: false,
                employeeDialog: false, // Dialog visibility
                employeeHeader:[ // dito ilalagay yung header ng employee
                    {title: 'Employee Code', model: 'employee_code'},
                    {title: 'Employee Name', model: 'employee_name'},
                    {title: 'Department Code', model: 'department_code',item: computed(()=> this.departmentData.map((item)=> item.department_name))},
                    {title: 'Section Code', model: 'section_code', item: computed(()=> this.sectionData.map((item)=> item.section_name))  },
                    {title: 'Team Code', model: 'team_code', item: computed(()=> this.teamData.map((item)=> item.team_name)) },  
                ]
            }
        },
        computed:{
            ...mapState(useStore, ['departmentData', 'sectionData', 'teamData']),
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
            this.getDepartments()
            this.getSections()
            this.getTeams()
        },
        methods:{ // dito ilalagay yung function para mag save at mag fetch ng data sa database
            ...mapActions (useStore,['getDepartments', 'getSections', 'getTeams']),

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
                    this.employeeObj = {};
                }else {
                    this.employeeObj = {...item};
                }
            }
        },
    };
</script>

<style scoped>

</style>


