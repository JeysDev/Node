<template>
    <div>
        <v-row dense>
            <v-col cols="12" class="text-center">
                <h1>
                    <v-icon class="mt-n3 mr-1">mdi-account-group</v-icon>
                    <span>Employees</span>
                </h1>

            </v-col>

            <v-col :cols="$vuetify.display.smAndDown ? 12 : 10">
                <!-- sa baba -->

                <v-text-field 
                    v-model="search" 
                    @keyup.enter="searchButton = true;" 
                    clearable placeholder="Search"  
                    prepend-inner-icon="mdi-magnify" hide-details>
                </v-text-field>
            </v-col>

            <v-col :cols="$vuetify.display.smAndDown ? 12 : 2">
                <v-btn block class="bg-primary" @click="openEmployeeDialog('Add', {})">
                    Add Employee
                </v-btn>
            </v-col>

            <v-col cols="12">
                <v-card elevation="6">
                    <v-table hover fixed-header height="calc(100vh - 250px)">
                        <thead>
                            <tr>
                                <!-- <th>Employee Code</th>
                                <th>Employee Name</th>
                                <th>Department Name</th>
                                <th>Section Name</th>
                                <th>Team Name</th> -->

                                <th class="bg-primary" v-for="(header, index) in employeeHeader" :key="index">
                                    {{ header.title }}
                                </th>
                                <th class="bg-primary">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr :style="item.deleted_at ? 'background-color: #FFDCDC;' : ''"
                                v-for="(item, index) in filteredEmployees" :key="index">
                                <!-- <td>{{ item.employee_code }}</td>
                                <td>{{ item.employee_name }}</td>
                                <td>{{ item.department_code }}</td>
                                <td>{{ item.section_code }}</td>
                                <td>{{ item.team_code }}</td> -->
                                <td v-for="(header, i) in employeeHeader" :key="i">

                                    <!-- <div :class="header.title === 'Team Code' ?
                                    'text-red' : ''"> -->
                                    {{ item[header.model] }}

                                    <!-- </div> -->
                                </td>
                                <td class="d-flex align-center ga-1">
                                    <template v-if="!item.deleted_at">
                                        <v-btn @click="openEmployeeDialog('Edit', item)" size="x-small" color="success"
                                            icon>
                                            <v-icon size="x-large">mdi-pencil</v-icon>
                                        </v-btn>

                                        <v-btn @click="deleteEmployee(item)" size="x-small" color="error" icon>
                                            <v-icon size="x-large">mdi-delete</v-icon>
                                        </v-btn>
                                    </template>

                                    <!-- @click="restoreEmployee(item)" sa baba-->
                                    <template v-else>
                                        <v-btn size="x-small" color="warning" @click="restoreEmployee(item)" icon>
                                            <v-icon size="x-large">mdi-refresh</v-icon>
                                        </v-btn>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog scrollable persistent width="450px" v-model="employeeDialog">
            <v-card>
                <v-card-title class="bg-primary"> {{ statusMode }} Employee</v-card-title>
                <v-card-text class="pa-4">
                    <v-form ref="form">
                        <div v-for="(item, i) in employeeHeader" :key="i">
                            <v-text-field class="mb-1" :label="item.title"
                                :rules="[v => !!v || item.title + 'is required']" v-model="employeeObject[item.model]"
                                v-if="item.title !== 'Department Code' && item.title !== 'Section Code'&& item.title !== 'Team Code'"
                                >
                                
                            </v-text-field>

                            <v-autocomplete
                                :label="item.title"
                                :rules="[v => !!v || item.title + 'is required']" v-model="employeeObject[item.model]"
                                :items="item.item"
                            v-else
                            />
                        </div>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="error" variant="tonal" @click="employeeDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn @click="saveEmployee()" variant="tonal" color="success">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import {computed} from 'vue'
import { useStore } from '@/stores/store';
import axios from 'axios'
import { mapActions, mapState } from 'pinia';
export default {
    data() {
        return {
            employeeData: [],
            employeeDialog: false,
            statusMode: '',
            employeeObject: {},
            employeeHeader: [
                { title: 'Employee Code', model: 'employee_code' },
                { title: 'Employee Name', model: 'employee_name' },
                { title: 'Department Code', model: 'department_code',item: computed(()=> this.departmentData.map((item)=> item.department_code))},
                { title: 'Section Code', model: 'section_code', item: computed(()=> this.sectionData.map((item)=> item.section_code))  },
                { title: 'Team Code', model: 'team_code', item: computed(()=> this.teamData.map((item)=> item.team_code)) },
            ],
            search: '',
            searchButton: false,
        }
    },
    mounted() {
        this.getEmployees()
        this.getDepartments()
        this.getSections()
        this.getTeams()
    },
    computed: {
        ...mapState(useStore, ['departmentData', 'sectionData', 'teamData']),
        filteredEmployees() {
            const filter = this.search?.toLowerCase();

            if (filter && this.searchButton) {
                return this.employeeData.filter((item) => {
                    return item.employee_code.toLowerCase().includes(filter) ||
                        item.employee_name.toLowerCase().includes(filter)
                });
            } else {
                this.searchButton = false;
                return this.employeeData;
            }
        }
    },

    methods: {
        ...mapActions(useStore, ['getDepartments', 'getSections', 'getTeams']),
        async getEmployees() {
            const api = 'http://10.169.142.121:9000/api/employees'

            //PROMISE
            // fetch(api,{
            //     method: 'get'
            // })
            // .then((res)=>{
            //     return res.json();

            // })
            // .then((data)=>{
            //     this.employeeData = data.data;

            // })
            // .catch((err)=> {
            //     console.error('Error' + err);
            //     alert(err);
            // });

            // ASYNC AWAIT
            // try{
            //     const res = await fetch (api, { method: 'get'});
            //     const data = await res.json();
            //     this.employeeData = data.data;
            // }catch (err){
            //     console.error('Error fetching data: ' +err);
            //     alert(err);
            // }

            // AXIOS PROMISE
            // axios({
            //     method: 'get';
            //     url: api
            // }).catch((err)=> {
            //     console.error('Error Fetching data: ' +err);
            //     alert(err);
            // })

            // AXIOS ASYNC AWAIT
            try {
                const res = await axios.get(api)
                this.employeeData = res.data.data
            } catch (err) {
                console.error('Error Fetching data: ' + err)
                alert(err)
            }
        },

        openEmployeeDialog(action, item) {
            this.statusMode = action;
            this.employeeDialog = true;

            if (action === 'Add') {
                this.employeeObject = {};
            } else {
                this.employeeObject = { ...item }
            }
        },

        async saveEmployee() {
            const api = 'http://10.169.142.121:9000/api/employees'

            const { valid } = await this.$refs.form.validate();

            if (valid) {

                axios({
                    method: this.statusMode === 'Add' ? 'post' : 'put',
                    url: api,
                    data: this.employeeObject
                })
                    .then((res) => {
                        this.employeeDialog = false;
                        alert(res.data.message);
                        this.getEmployees();
                    })
                    .catch((err) => {
                        console.error('Error saving data: ', err);
                        alert(err.response.data.message);
                    })

                //-------//
                // try {
                //     let res;

                //     if (this.statusMode === 'Add') {
                //         res = await axios.post(api, this.employeeObject)
                //     } else {
                //         res = await axios.put(api, this.employeeObject)
                //     }
                //     this.employeeDialog = false;
                //     alert(res.data.message);
                //     this.getEmployees();

                //     } catch (err) {
                //         console.error('Error saving data: ', err);
                //         alert(err.response.data.message);
                //     }

            }
        },


        deleteEmployee(item) {
            const api = 'http://10.169.142.121:9000/api/employees';

            if (confirm(`Are you sure to delete ${item.employee_code}?`)) {
                axios({
                    method: 'delete',
                    url: api,
                    data: item
                })
                    .then((res) => {
                        alert(res.data.message);
                        this.getEmployees();
                    })
                    .catch((err) => {
                        console.error('Error deleting data: ', err);
                        alert(err.response.data.message);
                    })
            }
        },
        restoreEmployee(item) {
            const api = 'http://10.169.142.121:9000/api/employees';

            if (confirm(`Are you sure to restore this ${item.employee_code}?`)) {
                axios({
                    method: 'patch',
                    url: api,
                    data: item
                })
                    .then((res) => {
                        alert(res.data.message);
                        this.getEmployees();
                    })
                    .catch((err) => {
                        console.error('Error restoring data: ', err);
                        alert(err.response.data.message);
                    })
            }
        },
    },
    // async restoreEmployee(){
    //         const api = 'http://10.169.142.121:9000/api/employees'

    //         const { valid } = await this.$refs.form.validate();

    //         if (valid) {

    //         axios({
    //             method: this.statusMode === 'Restore' ? 'patch' : 'put',
    //             url: api,
    //             data: this.employeeObject
    //         })
    //         .then((res)=>{
    //             console.log('Restore Function: ', res.data.message),
    //             this.employeeDialog = false;
    //             this.getEmployees();
    //         }).catch((err)=>{
    //             console.error('Error restoring data: ', err);
    //             alert(err.response.data.message);
    //         })
    //         }
    //     },
    ///----------------------------------------------------------------------------------------------------------------//
    // async searchFunction(){
    //         const res = await axios.post('http://10.169.142.121:9000/api/employees', {employee_name: this.searchModel})
    //         this.employeeData = [...res.data]
    //     },
    ///---------------------------------------------------------------------------------------------------------------//
}

</script>

<style scoped></style>