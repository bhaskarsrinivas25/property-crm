import api from './api'

export async function getProperties() {
  const response = await api.get('/properties')
  return response.data
}

export async function getPropertyById(id) {
  const response = await api.get(`/properties/${id}`)
  return response.data
}

export async function createProperty(property) {
  const response = await api.post('/properties', property)
  return response.data
}

export async function updateProperty(id, property) {
  const response = await api.put(`/properties/${id}`, property)
  return response.data
}

export async function deleteProperty(id) {
  await api.delete(`/properties/${id}`)
}