# Tractor Service Form

A web application for managing tractor service forms with persistent database storage.

## Features

- **Service Form**: Capture detailed tractor service information
- **Database Storage**: Uses IndexedDB for local persistent storage
- **Service Records**: View all submitted service records
- **Delete Records**: Remove service records as needed
- **Responsive Design**: Works on desktop and mobile devices

## Form Fields

The tractor service form collects the following information:

- **Tractor ID**: Unique identifier for the tractor
- **Tractor Model**: Model/brand of the tractor
- **Service Type**: Type of service (Maintenance, Repair, Inspection, Cleaning, Oil Change)
- **Service Date**: Date when the service was performed
- **Technician Name**: Name of the technician who performed the service
- **Service Description**: Detailed description of the work performed
- **Kilometers of Transport**: Distance traveled for the service in kilometers
- **Service Cost**: Cost of the service in dollars
- **Hours Worked**: Number of hours spent on the service

## Database Schema

### Service Record Object

```javascript
{
    id: Number,                    // Auto-incremented ID
    tractorId: String,             // Tractor identifier
    tractorModel: String,          // Tractor model
    serviceType: String,           // Type of service
    serviceDate: String,           // Date of service (YYYY-MM-DD)
    technicianName: String,        // Name of technician
    description: String,           // Service description
    kilometers: Number,            // Kilometers of transport
    cost: Number,                  // Service cost in dollars
    hoursWorked: Number,           // Hours worked
    createdAt: String,             // Timestamp of record creation
    updatedAt: String              // Timestamp of last update (if applicable)
}
```

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: IndexedDB (Browser-based NoSQL database)
- **No Backend Required**: All data is stored locally in the browser

## File Structure

```
tractor-service-form/
├── index.html       # HTML form structure
├── styles.css       # CSS styling
├── app.js          # Main application logic
├── db.js           # Database module (IndexedDB)
└── README.md       # This file
```

## How to Use

1. **Open the Application**: Open `index.html` in a web browser
2. **Fill Out the Form**: Complete all required fields in the tractor service form
3. **Submit**: Click the "Submit Service Form" button
4. **View Records**: All submitted records appear in the "Service Records" section on the right
5. **Delete Records**: Click the "Delete" button on any record to remove it

## Database Methods

The database module (`db.js`) provides the following methods:

- `init()` - Initialize the database
- `addService(serviceData)` - Add a new service record
- `getAllServices()` - Retrieve all service records
- `getServicesByTractorId(tractorId)` - Get records for a specific tractor
- `getServicesByType(serviceType)` - Get records by service type
- `deleteService(id)` - Delete a service record
- `updateService(id, updatedData)` - Update a service record
- `clearAllServices()` - Clear all records

## Features to Add

Future enhancements could include:

- [ ] Export records to CSV/PDF
- [ ] Filter and search records
- [ ] Edit existing records
- [ ] Charts and statistics
- [ ] Backend API integration for cloud sync
- [ ] User authentication
- [ ] Multiple user accounts
- [ ] Cost and hours analytics
- [ ] Kilometers analytics

## Browser Compatibility

- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge
- Any browser supporting IndexedDB

## Notes

- Data is stored locally in your browser's IndexedDB
- Clearing browser storage will delete all records
- Each browser/device maintains its own database
- No data is sent to any server

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.