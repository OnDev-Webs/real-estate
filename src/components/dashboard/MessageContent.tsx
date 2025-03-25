
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  unreadCount: number;
  lastActive: string;
}

const MessageContent = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState("");
  
  // Mock data - would come from API in a real app
  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "John Smith",
      avatar: "",
      lastMessage: "Hi, I'm interested in the property",
      unreadCount: 2,
      lastActive: "10 minutes ago"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: "",
      lastMessage: "Is the property still available?",
      unreadCount: 0,
      lastActive: "1 hour ago"
    },
    {
      id: "3",
      name: "Robert Davis",
      avatar: "",
      lastMessage: "What's the best time to view?",
      unreadCount: 1,
      lastActive: "Yesterday"
    }
  ]);
  
  // Mock messages for the selected contact
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "1",
      receiverId: user?.id || "current",
      content: "Hi, I'm interested in the modern apartment in Mumbai. Is it still available?",
      timestamp: new Date(Date.now() - 3600000 * 2),
      read: true
    },
    {
      id: "2",
      senderId: user?.id || "current",
      receiverId: "1",
      content: "Yes, it's still available! Would you like to schedule a viewing?",
      timestamp: new Date(Date.now() - 3600000),
      read: true
    },
    {
      id: "3",
      senderId: "1",
      receiverId: user?.id || "current",
      content: "That would be great. What times do you have available this weekend?",
      timestamp: new Date(Date.now() - 1800000),
      read: false
    }
  ]);
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || "current",
      receiverId: selectedContact.id,
      content: messageText,
      timestamp: new Date(),
      read: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="h-[75vh]">
      <Card className="h-full">
        <CardHeader className="pb-4">
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Contacts List */}
            <div className="border-r border-gray-200 h-full">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search contacts..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[calc(75vh-140px)]">
                <div className="divide-y">
                  {filteredContacts.map(contact => (
                    <div 
                      key={contact.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedContact?.id === contact.id ? 'bg-gray-50' : ''}`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{contact.name}</h4>
                            <span className="text-xs text-gray-500">{contact.lastActive}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                        </div>
                        {contact.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredContacts.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                      No contacts found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            {/* Messages */}
            <div className="col-span-2 flex flex-col h-full">
              {selectedContact ? (
                <>
                  {/* Message Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedContact.avatar} />
                      <AvatarFallback>{selectedContact.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{selectedContact.name}</h4>
                      <p className="text-xs text-gray-500">Last active {selectedContact.lastActive}</p>
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map(message => {
                        const isCurrentUser = message.senderId === (user?.id || "current");
                        
                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] rounded-lg p-3 ${
                              isCurrentUser 
                                ? 'bg-estate-primary text-white rounded-tr-none' 
                                : 'bg-gray-100 rounded-tl-none'
                            }`}>
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${isCurrentUser ? 'text-estate-primary-100' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
                    <Input 
                      placeholder="Type a message..." 
                      value={messageText} 
                      onChange={e => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="bg-estate-primary hover:bg-estate-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-center text-gray-500">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Select a contact</h3>
                    <p>Choose a contact to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageContent;
