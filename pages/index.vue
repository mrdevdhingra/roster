<script setup>
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
const router = useRouter();

if(authStore.user===null){
    router.push({path:"/login"});
}else{
    router.push({path:"/home"})
}

</script>