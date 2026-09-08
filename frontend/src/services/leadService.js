import api from './api'

function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error.response) return 'Unable to reach the backend. Check that the Spring Boot server is running.'
  if (error.response.status === 400) {
    const data = error.response.data
    if (data?.errors && typeof data.errors === 'object') return Object.values(data.errors).join(' ')
    return data?.message || 'Please check the lead details and try again.'
  }
  if (error.response.status === 404) return 'The requested lead could not be found.'
  return error.response.data?.message || fallback
}

async function getLeads() {
  const response = await api.get('/leads')
  return response.data
}

async function getLeadById(id) {
  const response = await api.get(`/leads/${id}`)
  return response.data
}

async function createLead(data) {
  const response = await api.post('/leads', data)
  return response.data
}

async function updateLead(id, data) {
  const response = await api.put(`/leads/${id}`, data)
  return response.data
}

async function deleteLead(id) {
  await api.delete(`/leads/${id}`)
}

export { createLead, deleteLead, getErrorMessage, getLeadById, getLeads, updateLead }
