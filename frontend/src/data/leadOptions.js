const propertyTypes = ['APARTMENT', 'HOUSE', 'VILLA', 'PLOT', 'LAND', 'OFFICE', 'SHOP', 'COMMERCIAL', 'OTHER']
const leadSources = ['WEBSITE', 'PHONE', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE', 'WALK_IN', 'REFERRAL', 'OTHER']
const leadStatuses = ['NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT', 'NEGOTIATION', 'BOOKED', 'CONVERTED', 'LOST']

const blankLead = {
  name: '', phone: '', email: '', propertyType: '', requirement: '', preferredLocation: '', budget: '', leadSource: '', status: 'NEW', followUpDate: '', notes: '',
}

function formatOption(value) {
  return value.replaceAll('_', ' ')
}

export { blankLead, formatOption, leadSources, leadStatuses, propertyTypes }
