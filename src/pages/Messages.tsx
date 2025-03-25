
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, Paperclip, MoreVertical, CheckCircle, Phone, Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

// Sample messages data
const conversations = [
  {
    id: 1,
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80",
    lastMessage: "Hi, I'm interested in your property",
    lastMessageTime: "10:30 AM",
    unread: 2,
    online: true,
    messages: [
      {
        id: 1,
        senderId: "other",
        text: "Hello! I saw your listing for the apartment in downtown.",
        time: "10:00 AM"
      },
      {
        id: 2,
        senderId: "user",
        text: "Hi John, thanks for reaching out! What would you like to know about it?",
        time: "10:15 AM"
      },
      {
        id: 3,
        senderId: "other",
        text: "I'm wondering if it's still available for viewing this weekend?",
        time: "10:17 AM"
      },
      {
        id: 4,
        senderId: "other",
        text: "Also, is the parking included in the rent?",
        time: "10:18 AM"
      },
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80",
    lastMessage: "When can we schedule a viewing?",
    lastMessageTime: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        senderId: "other",
        text: "Good afternoon, I'm inquiring about the house listing on Oak Street.",
        time: "Yesterday"
      },
      {
        id: 2,
        senderId: "user",
        text: "Hello Sarah! The house is still available. Are you interested in viewing it?",
        time: "Yesterday"
      },
      {
        id: 3,
        senderId: "other",
        text: "Yes, definitely! When can we schedule a viewing?",
        time: "Yesterday"
      },
    ]
  },
  {
    id: 3,
    name: "Michael Brown",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80",
    lastMessage: "What's the square footage?",
    lastMessageTime: "2 days ago",
    unread: 0,
    online: true,
    messages: [
      {
        id: 1,
        senderId: "other",
        text: "Hi there. I have a few questions about the condo you've listed.",
        time: "2 days ago"
      },
      {
        id: 2,
        senderId: "user",
        text: "Hello Michael, I'd be happy to answer your questions!",
        time: "2 days ago"
      },
      {
        id: 3,
        senderId: "other",
        text: "Thank you. What's the square footage?",
        time: "2 days ago"
      },
    ]
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80",
    lastMessage: "Is this property pet-friendly?",
    lastMessageTime: "Last week",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        senderId: "other",
        text: "Hello, I'm very interested in the townhouse listing.",
        time: "Last week"
      },
      {
        id: 2,
        senderId: "other",
        text: "Is this property pet-friendly?",
        time: "Last week"
      },
    ]
  },
];

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    conversation => conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      // In a real app, this would call an API to send the message
      setMessageText("");
    }
  };
  
  // Mock user data when no user is authenticated
  const mockUser = user || {
    name: "Guest User",
    role: "buyer",
    avatar: "https://via.placeholder.com/40"
  };
  
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-6 flex-1">
        <div className="text-2xl font-bold mb-6">Messages</div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Tabs defaultValue="inbox" className="w-full">
            <div className="border-b">
              <div className="px-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="inbox">Inbox</TabsTrigger>
                  <TabsTrigger value="archive">Archive</TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <TabsContent value="inbox" className="m-0">
              <div className="flex h-[75vh]">
                {/* Conversations List */}
                <div className="w-1/3 border-r">
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search messages..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(75vh-60px)]">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 border-b flex items-center cursor-pointer hover:bg-gray-50 transition-colors ${
                          activeConversation.id === conversation.id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => setActiveConversation(conversation)}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <img
                              src={conversation.avatar}
                              alt={conversation.name}
                              className="object-cover"
                            />
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                          )}
                        </div>
                        <div className="ml-3 flex-1 overflow-hidden">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-sm">{conversation.name}</h3>
                            <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge className="ml-2 bg-black text-white hover:bg-black/90">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                
                {/* Chat Area */}
                <div className="w-2/3 flex flex-col">
                  {activeConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <img
                              src={activeConversation.avatar}
                              alt={activeConversation.name}
                              className="object-cover"
                            />
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{activeConversation.name}</h3>
                            <span className="text-xs text-gray-500">
                              {activeConversation.online ? "Online" : "Offline"}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4">
                        {activeConversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`mb-4 flex ${
                              message.senderId === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            {message.senderId === "other" && (
                              <Avatar className="h-8 w-8 mr-2 mt-1">
                                <img
                                  src={activeConversation.avatar}
                                  alt={activeConversation.name}
                                  className="object-cover"
                                />
                              </Avatar>
                            )}
                            <div>
                              <Card
                                className={`max-w-md ${
                                  message.senderId === "user"
                                    ? "bg-black text-white"
                                    : ""
                                }`}
                              >
                                <CardContent className="p-3">
                                  <p>{message.text}</p>
                                </CardContent>
                              </Card>
                              <div
                                className={`text-xs text-gray-500 mt-1 ${
                                  message.senderId === "user" ? "text-right" : ""
                                }`}
                              >
                                {message.time}
                                {message.senderId === "user" && (
                                  <CheckCircle className="h-3 w-3 inline ml-1 text-black" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                      
                      {/* Message Input */}
                      <div className="p-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Input
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button 
                            variant="default"
                            size="icon"
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                            className="bg-black hover:bg-black/90"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="font-medium text-lg">No conversation selected</h3>
                        <p className="text-gray-500">Choose a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="archive" className="m-0">
              <div className="flex items-center justify-center h-[75vh]">
                <div className="text-center">
                  <h3 className="font-medium text-lg">No archived messages</h3>
                  <p className="text-gray-500">Messages you archive will appear here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;
