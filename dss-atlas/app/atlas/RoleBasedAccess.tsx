import React from 'react';
import { useUserRole } from './UserRoleProvider';
import { UserRole } from '@/types/atlas';

interface RoleBasedAccessProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function RoleBasedAccess({ allowedRoles, children, fallback = null }: RoleBasedAccessProps) {
    const { role } = useUserRole();

    if (allowedRoles.includes(role)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
