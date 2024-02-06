// store/auth.js
import { defineStore } from 'pinia'

// store/auth.js
export const useAuthStore = defineStore('auth', {
    state: () => ({
      user: null,
      workspaces:null,
      currentWorkspace:null
    }),
    actions: {
      setUser(userData){
        this.user = userData;
      },
      setWorkspaces(data){
        this.workspaces = data;
      },
      setCurrentWorkspace(data){
        this.currentWorkspace = data;
      }
    },
    persist: true
  })
  