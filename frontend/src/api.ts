import axios from 'axios'
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1'

export const fetchSkins = async () => {
  return axios.get(API_BASE + '/skins')
}
export const analyzeSkin = async (name:string) => axios.get(API_BASE + '/alerts/analyze/' + encodeURIComponent(name))
