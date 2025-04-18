import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAllProperties } from '@/services/propertyService';

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const { toast } = useToast();
  const isFirstRun = useRef(true);

  // Log notifications state whenever it changes
  useEffect(() => {
    console.log('Notifications state:', notifications);
  }, [notifications]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/users/all', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await res.json();
      console.log('Fetched users:', data.users);
      return data.success ? data.users : [];
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  };

  // Fetch properties via service
  const fetchProperties = async () => {
    try {
      const data = await getAllProperties();
      console.log('Fetched properties:', data);
      return data;
    } catch (err) {
      console.error('Error fetching properties:', err);
      return [];
    }
  };

  // Poll for new users and properties and initialize notifications
  useEffect(() => {
    const loadInitial = async () => {
      const [u, p] = await Promise.all([fetchUsers(), fetchProperties()]);
      console.log('Initial users:', u);
      console.log('Initial properties:', p);
      setUsers(u);
      setProperties(p);

      // Generate notifications for existing records
      const userNotes = u.map((user) => ({
        id: `user-${user._id}`,
        type: 'User',
        message: `User registered: ${user.name}`,
        timestamp: user.createdAt || new Date().toISOString(),
      }));
      const propNotes = p.map((prop) => ({
        id: `property-${prop._id}`,
        type: 'Property',
        message: `Property listed: ${prop.title}`,
        timestamp: prop.createdAt || new Date().toISOString(),
      }));
      // Sort descending by timestamp
      const combined = [...userNotes, ...propNotes].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setNotifications(combined);

      isFirstRun.current = false;
    };
    loadInitial();

    const intervalId = setInterval(async () => {
      const [newUsers, newProps] = await Promise.all([fetchUsers(), fetchProperties()]);
      console.log('Polling - users:', newUsers, 'properties:', newProps);

      // Added users
      if (!isFirstRun.current && newUsers.length > users.length) {
        const added = newUsers.slice(0, newUsers.length - users.length);
        added.forEach((u) => {
          const note = {
            id: `user-${u._id}`,
            type: 'User',
            message: `New user registered: ${u.name}`,
            timestamp: new Date().toISOString(),
          };
          console.log('New user notification:', note);
          setNotifications((prev) => [note, ...prev]);
          toast({ title: 'User Added', description: `${u.name} joined` });
        });
      }

      // Added properties
      if (!isFirstRun.current && newProps.length > properties.length) {
        const addedProps = newProps.slice(0, newProps.length - properties.length);
        addedProps.forEach((p) => {
          const note = {
            id: `property-${p._id}`,
            type: 'Property',
            message: `New property listed: ${p.title}`,
            timestamp: new Date().toISOString(),
          };
          console.log('New property notification:', note);
          setNotifications((prev) => [note, ...prev]);
          toast({ title: 'Property Added', description: `${p.title} has been added` });
        });
      }

      setUsers(newUsers);
      setProperties(newProps);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [users, properties, toast]);

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Notifications</CardTitle>
        <Badge variant="secondary">{notifications.length}</Badge>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-center py-10">No notifications yet.</p>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>
                      <Badge variant={note.type === 'User' ? 'info' : 'outline'}>
                        {note.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{note.message}</TableCell>
                    <TableCell>{formatDate(note.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPage;
