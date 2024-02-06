import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Redirect to home if not logged in
  if (!authStore.user) {
    return navigateTo('/');
  }

  // Check if the route is a workspace route
  if (to.path.startsWith('/workspace/')) {
    
    const workspaceId = parseInt(to.params.id); // Get the workspace ID from the route
    console.log(workspaceId)
    const userWorkspaces = authStore.workspaces.map(w => w.workspace.id);
    console.log(userWorkspaces)

    // Check if the user has access to this workspace
    if (!userWorkspaces.includes(workspaceId)) {
      // If not, redirect to home
      console.log("not auth");
      return navigateTo('/home');
    }
  }
});
