import { useEffect, useRef } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import toast from 'react-hot-toast';
import { axiosClient } from '../api/axiosClient';
import type { User } from '../types/user';
import { useAuth } from './useAuth';

const API_URL = `${axiosClient.defaults.baseURL}/hubs/notifications`; 

export const useSignalR = () => {    
    const connectionRef = useRef<HubConnection | null>(null);
    const { user, login, logout } = useAuth();
    
    useEffect(() => {        
        const authToken = user?.authToken;                   
        if (!authToken) return;

        // 2. Budujemy połączenie
        const newConnection = new HubConnectionBuilder()
            .withUrl(API_URL, {                
                accessTokenFactory: () => user?.authToken || '', 
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
        
        newConnection.on("ReceiveNotification", (message: string) => {
            console.log("🔔 SIGNALR MESSAGE:", message);
            toast.success(message, {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: '#1f2937', // dark-gray-800
                    color: '#fff',
                    border: '1px solid #374151'
                }
            });
        });
        
        newConnection.start()
            .then(() => {
                console.log("✅ SignalR Connected!");
                connectionRef.current = newConnection;
            })
            .catch(err => console.error("❌ SignalR Connection Error: ", err));
        
        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, []);

    return connectionRef.current;
};