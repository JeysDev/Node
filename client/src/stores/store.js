import {defineStore} from "pinia";
import axios from "axios";

export const useStore =defineStore('store', {
    state: () => ({
        api: import.meta.env.VITE_BASE_URL,
        departmentData: [],
        sectionData:[],
        teamData:[],
        employeeData: [],
    }),
    getters:{ 

    },

    actions:{
        async getDepartments(){
            axios({
                method: 'get',
                url: `${this.api}/api/departments`,
            })
            .then((res)=>{
                this.departmentData = res.data.data;
            })
            .catch((err)=>{
                console.error('Error fetching departments:', err);
            })
        },
        async getSections(){
            axios({
                method: 'get',
                url: `${this.api}/api/sections`,
            })
            .then((res)=>{
                this.sectionData = res.data.data;
            })
            .catch((err)=>{
                console.error('Error fetching sections:', err);
            })
        },
        async getTeams(){
            axios({
                method: 'get',
                url: `${this.api}/api/teams`,
            })
            .then((res)=>{
                this.teamData = res.data.data;
            })
            .catch((err)=>{
                console.error('Error fetching sections:', err);
            })
        },
        async getEmployees(){
            axios({
                method: 'get',
                url: `${this.api}/api/employees`,
            })
            .then((res)=>{
                this.employeeData = res.data.data;
            })
            .catch((err)=>{
                console.error('Error fetching employees:', err);
            })
        }
    }
});