import api from './api'

export async function getFollowUps() {
  const response = await api.get('/follow-ups')
  return response.data
}

export async function getFollowUpById(id) {
  const response = await api.get(`/follow-ups/${id}`)
  return response.data
}

export async function createFollowUp(followUp) {
  const response = await api.post('/follow-ups', followUp)
  return response.data
}

export async function updateFollowUp(id, followUp) {
  const response = await api.put(`/follow-ups/${id}`, followUp)
  return response.data
}

export async function deleteFollowUp(id) {
  await api.delete(`/follow-ups/${id}`)
}