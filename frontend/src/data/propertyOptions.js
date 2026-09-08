const propertyTypes = ['APARTMENT', 'HOUSE', 'VILLA', 'PLOT', 'LAND', 'OFFICE', 'SHOP', 'COMMERCIAL', 'OTHER']
const listingTypes = ['SALE', 'RENT']
const propertyStatuses = ['AVAILABLE', 'RESERVED', 'SOLD', 'RENTED', 'INACTIVE']

const blankProperty = {
  title: '', propertyType: '', listingType: '', location: '', address: '', price: '', bedrooms: '', bathrooms: '', area: '', description: '', status: 'AVAILABLE', ownerName: '', ownerPhone: '',
}

function formatPropertyOption(value) {
  return value.replaceAll('_', ' ')
}

export { blankProperty, formatPropertyOption, listingTypes, propertyStatuses, propertyTypes }
