<template>
    <div class="container">
        <v-row>
            <v-col
                
                :cols="$vuetify.display.smAndDown ? 12 : $vuetify.display.md ? 6 : 4"
                v-for="(item, index) in crudData" :key="index"
            >
                <v-row>
                    <v-col cols="12" class="text-center">
                        <h1 style="color:orange">{{ item.title }}</h1>
                    </v-col>

                    <v-col :cols="$vuetify.display.smAndDown ? 12 : 8">
                        <v-text-field 
                            
                            hide-details
                            placeholder="Search"
                            prepend-inner-icon="mdi-magnify"
                            v-model= "item.search"
                            style="color:Orange"
                        ></v-text-field>
                    </v-col>
                    <v-col :cols="$vuetify.display.smAndDown ? 12 : 4">
                        <v-btn
                            block
                            class="bg-orange"
                            @click="openAddEditDialog(item.title, 'Add', {}, item.prefix)"
                        >
                            {{ item.buttonLabel }}
                        </v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-card elevation="6">
                            <v-table hover fixed-header density="compact" height="calc(100vh - 250px)" theme="dark"> 
                                <thead>
                                    <tr>
                                        <th style="color:orange" v-for="(header, i) in item.headers" :key="i">
                                            {{ header.title }}
                                        </th>
                                        <th style="color:orange">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        :class="val.deleted_at ? 'bg-red' : ''"
                                        v-for="(val, i) in 
                                            item.title === 'Departments' ? filteredDepartments :
                                            item.title === 'Sections' ? filteredSections :
                                            item.title === 'Teams' ? filteredTeams : item.items" :key="i"
                                            >
                                        <td style="color:orange" v-for="(header, ii) in item.headers" :key="ii">
                                            {{ val[header.model] }}
                                        </td>
                                        <td class="d-flex align-center gap-1">
                                            <template v-if="!val.deleted_at">
                                                <v-btn
                                                    icon
                                                    size="x-small"
                                                    class="hover"
                                                    color="blue"
                                                    @click="openAddEditDialog(item.title, 'Edit', val, item.prefix )" >
                                                    <v-icon size="large">mdi-pen</v-icon>
                                                </v-btn>
                                                <v-btn 
                                                    icon
                                                    size="x-small"
                                                    color="red"
                                                    class="hover"
                                                    @click="deleteFunction(item.title, 'Deletes', val, item.prefix )" >
                                                    <v-icon size="large">mdi-delete</v-icon>
                                                </v-btn>     
                                            </template>
                                            <template v-else>
                                                <v-btn 
                                                    size="x-small"
                                                    color="warning"
                                                    class="hover"
                                                    icon
                                                    @click="restoreFunction(item.title, 'Restore', val, item.prefix )" >
                                                    <v-icon size="large">mdi-refresh</v-icon>
                                                </v-btn>
                                            </template>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-dialog scrollable persistent width="450px" v-model="CrudDialog">
            <v-card style="color:orange; background-color:black" >
                <v-card-title class="bg-orange">{{ statusMode }}</v-card-title>
                <v-card-text class="pa-4">
                    <v-form ref="form">
                        <div v-for="(item,i) in crudData[crudTitle].headers" :key="i">
                        <v-text-field                             
                            class="mb-1"
                            :label="item.title"
                            :rules="[v => !!v || item.title + 'is required']"
                            v-model="crudObject[item.model]">
                        </v-text-field>
                        </div>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn
                        color="error"
                        variant="tonal"
                        @click="CrudDialog = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="success"
                        variant="tonal"
                        @click="saveCrud(item)"
                    >
                        {{ statusMode }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import { computed } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useStore } from '@/stores/store.js';

export default {
   data () {
       return {
            deleteDialog: false,
            CrudDialog:false,
            actionMode:'',
            statusMode:'',
            crudObject: {},
            crudPrefix: '',
            crudTitle:'',
            crudData: {
                Departments:{
                    title:'Departments',
                    search: '',
                    buttonLabel:'Add Department',
                    headers:[
                        {title:'Department Code', model: 'department_code'},
                        {title:'Department Name', model: 'department_name'}
                    ],
                    prefix: 'departments',
                },
                Sections:{
                    title:'Sections',
                    search: '',
                    buttonLabel:'Add Section',
                    headers:[
                        {title:'Section Code', model: 'section_code'},
                        {title:'Section Name', model: 'section_name'}
                    ],
                    prefix: 'sections',
                },
                Teams:{
                    title:'Teams',
                    search: '',
                    buttonLabel:'Add Team',
                    headers:[
                        {title:'Team Code', model: 'team_code'},
                        {title:'Team Name', model: 'team_name'}
                    ],
                    prefix: 'teams',
                },
            }
        };
    },
        mounted () {
         this.getDepartments();
         this.getSections();
         this.getTeams();
        },
            computed: {
                ...mapState(useStore,['departmentData', 'sectionData', 'teamData', 'api']),
                filteredDepartments(){
                    const filter = this.crudData.Departments.search?.toLowerCase();
                    if(filter){
                        return this.departmentData.filter((item)=>{
                            return item.department_code.toLowerCase().includes(filter) ||
                            item.department_name.toLowerCase().includes(filter)
                        });
                    }else{
                        return this.departmentData;
                    }
                },
                filteredSections(){
                    const filter = this.crudData.Sections.search?.toLowerCase();
                    if(filter){
                        return this.sectionData.filter((item)=>{
                            return item.section_code.toLowerCase().includes(filter) ||
                            item.section_name.toLowerCase().includes(filter)
                        });
                    }else{
                        return this.sectionData;
                    }
                },
                filteredTeams(){
                    const filter = this.crudData.Teams.search?.toLowerCase();
                    if(filter){
                        return this.teamData.filter((item)=>{
                            return item.team_code.toLowerCase().includes(filter) ||
                            item.team_name.toLowerCase().includes(filter)
                        });
                    }else{
                        return this.teamData;
                    }
                }
            },
        methods: {
            ...mapActions (useStore,['getDepartments', 'getSections', 'getTeams']),

            openAddEditDialog(title, action, val, prefix){
                this.CrudDialog = true;
                this.crudTitle = title;
                this.crudPrefix = prefix;
                this.actionMode = action;
                this.statusMode = `${action} ${title.slice(0, -1)}`

                if (action === 'Add'){
                    this.crudObject ={};
                }
                else{
                    this.crudObject ={...val}
                }
            },
            openDepartmentDialog(action, item){
                this.statusMode = action;
                this.departmentDialog = true;

                if (action == 'Add'){
                    this.crudObject ={};
                }else{
                    this.crudObject= {...item}
                }
            },
            async saveCrud(){
                const { valid } = await this.$refs.form.validate();
                if(valid) {
                    let url = `${this.api}/api/${this.crudPrefix}`;
                    if(this.actionMode === 'Edit' && this.crudObject.id){
                        url += `/${this.crudObject.id}`;
                    }
                    axios({
                        method: this.actionMode === 'Add' ? 'post' : 
                                this.actionMode === 'Edit' ? 'put' : 
                                this.actionMode === 'Deletes' ? 'delete' : 
                                'patch',
                        url: url,
                        data: this.crudObject,
                    })
                    .then((res)=>{
                        this.CrudDialog = false;
                        alert(res.data.message);
                        this.getDepartments();
                        this.getSections();
                        this.getTeams();
                    })
                    .catch((err)=>{
                        console.error ('Error saving Data:', err);
                        alert(err.response.data.message);
                    })
                }
            },
            deleteFunction(title ,action, val, prefix){
                const name =val.department_name || val.section_name || val.team_name;
                this.crudPrefix = prefix;
                let api = `${this.api}/api/${this.crudPrefix}`;
                if(confirm((`Are you sure you want to delete? ${name}`))){
                    api += `/${val.id}`;
                    axios ({
                        method: 'delete',
                        url: api,
                    })
                    .then((res)=> {
                        alert(res.data.message);
                        this.getDepartments();
                        this.getSections();
                        this.getTeams();
                    })
                    .catch((err)=>{
                        console.error ('Error deleting Data:', err);
                        alert(err.response.data.message);
                    })
                }
            },
            restoreFunction(title, action, val, prefix){
                this.crudPrefix = prefix;
                let api = `${this.api}/api/${this.crudPrefix}`;
                if(confirm((`Are you sure you want to restore ${title}?`)))
                axios({
                    method: 'patch',
                    url: api,
                    data: val
                })
                .then((res) => {
                    alert(res.data.message);
                    this.getDepartments();
                    this.getSections();
                    this.getTeams();
                })
                .catch((err) => {
                    console.error("Error saving data: " + err);
                    alert(err.response.data.message);
                });
            },
        },
}
</script>
<style lang="scss" scoped>

</style>