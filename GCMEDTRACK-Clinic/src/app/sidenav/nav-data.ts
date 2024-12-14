interface INavbarData {
    routeLink: string;
    icon: string;
    label: string;
}

export const navbarData: INavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'fas fa-home',
        label: 'Dashboard'
    },
    {
        routeLink: '/usermanagement',
        icon: 'fas fa-users',
        label: 'User Management'
    },
    {
        routeLink: 'documents',
        icon: 'fas fa-file-medical',
        label: 'Documents'
    },
    {
        routeLink: 'schedulebooking',
        icon: 'fas fa-calendar-alt',
        label: 'Schedule Booking'
    },
    {
        routeLink: 'appointments',
        icon: 'fas fa-calendar-check',
        label: 'Appointments'
    },
    {
        routeLink: 'logout',
        icon: 'fas fa-sign-out-alt',
        label: 'Logout'
    }
];