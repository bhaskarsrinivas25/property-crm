import api from './api'

export async function getSiteVisits() {
  const response = await api.get('/site-visits')
  return response.data
}

export async function getSiteVisitById(id) {
  const response = await api.get(`/site-visits/${id}`)
  return response.data
}

export async function createSiteVisit(siteVisit) {
  const response = await api.post('/site-visits', siteVisit)
  return response.data
}

export async function updateSiteVisit(id, siteVisit) {
  const response = await api.put(`/site-visits/${id}`, siteVisit)
  return response.data
}

export async function deleteSiteVisit(id) {
  await api.delete(`/site-visits/${id}`)
}