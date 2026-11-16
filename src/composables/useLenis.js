import { ref } from 'vue'

const lenisInstance = ref(null)

export function useLenis() {
  const setLenis = (instance) => {
    lenisInstance.value = instance
  }
  
  const stopLenis = () => {
    if (lenisInstance.value) lenisInstance.value.stop()
  }
  
  const startLenis = () => {
    if (lenisInstance.value) lenisInstance.value.start()
  }

  return { lenisInstance, setLenis, stopLenis, startLenis }
}
