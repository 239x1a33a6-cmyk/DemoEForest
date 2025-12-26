import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserPermissions } from '@/types/atlas';

interface UserContextType {
    role: UserRole;
    permissions: UserPermissions;
    setRole: (role: UserRole) => void;
}

const defaultPermissions: Record<UserRole, UserPermissions> = {
    admin: {
        canEdit: true,
        canExport: true,
        canViewAnalytics: true,
        canManageSchemes: true,
        canAccessAllStates: true,
    },
    district: {
        canEdit: true,
        canExport: true,
        canViewAnalytics: true,
        canManageSchemes: false,
        canAccessAllStates: false,
    },
    public: {
        canEdit: false,
        canExport: false,
        canViewAnalytics: false,
        canManageSchemes: false,
        canAccessAllStates: false,
    },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<UserRole>('public');
    const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions.public);

    useEffect(() => {
        setPermissions(defaultPermissions[role]);
    }, [role]);

    return (
        <UserContext.Provider value={{ role, permissions, setRole }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserRole() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserRole must be used within a UserRoleProvider');
    }
    return context;
}
