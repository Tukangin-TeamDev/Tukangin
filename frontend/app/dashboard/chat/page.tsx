'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Mic,
  Send,
  MessageSquare,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'provider';
  text: string;
  time: string;
}

interface ChatContact {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>('bengkel-jaya');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: 'bengkel-jaya',
      name: 'Bengkel Jaya',
      status: 'online',
      lastMessage: 'Baik, kami akan datang besok pagi jam 9.',
      time: '10:30',
      unread: 2,
      avatar: '/placeholder.svg?height=48&width=48',
    },
    {
      id: 'tukang-cat',
      name: 'Tukang Cat',
      status: 'offline',
      lastMessage: 'Apakah besok bisa dilakukan pengecatan?',
      time: 'Kemarin',
      unread: 0,
      avatar: '/placeholder.svg?height=48&width=48',
    },
    {
      id: 'listrik-handal',
      name: 'Listrik Handal',
      status: 'online',
      lastMessage: 'Terima kasih atas pesanan Anda.',
      time: 'Kemarin',
      unread: 0,
      avatar: '/placeholder.svg?height=48&width=48',
    },
    {
      id: 'admin-tukangin',
      name: 'Admin Tukangin',
      status: 'online',
      lastMessage: 'Selamat datang di Tukangin!',
      time: '12/05',
      unread: 0,
      avatar: '/placeholder.svg?height=48&width=48',
    },
  ]);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'bengkel-jaya': [
      {
        id: '1',
        sender: 'provider',
        text: 'Untuk genteng beton dengan 3 titik kebocoran, biasanya berkisar antara Rp350.000 - Rp500.000 tergantung tingkat kesulitan dan material yang dibutuhkan. Apakah Anda ingin kami melakukan survei terlebih dahulu?',
        time: '09:40',
      },
      {
        id: '2',
        sender: 'user',
        text: 'Ya, saya ingin survei dulu. Kapan bisa dilakukan?',
        time: '09:42',
      },
      {
        id: '3',
        sender: 'provider',
        text: 'Kami bisa melakukan survei besok pagi sekitar jam 9 atau siang jam 1. Mana yang lebih nyaman untuk Anda?',
        time: '09:45',
      },
    ],
    'tukang-cat': [
      {
        id: '1',
        sender: 'user',
        text: 'Halo, saya ingin menanyakan tentang jasa pengecatan rumah.',
        time: '14:20',
      },
      {
        id: '2',
        sender: 'provider',
        text: 'Selamat siang, terima kasih telah menghubungi kami. Untuk pengecatan rumah, kami membutuhkan informasi luas area yang akan dicat.',
        time: '14:25',
      },
      {
        id: '3',
        sender: 'user',
        text: 'Rumah saya 2 lantai dengan total luas sekitar 200m².',
        time: '14:30',
      },
    ],
  });

  const filteredContacts = contacts
    .filter(contact => {
      if (activeTab === 'all') return true;
      if (activeTab === 'providers') return contact.id !== 'admin-tukangin';
      if (activeTab === 'admin') return contact.id === 'admin-tukangin';
      return true;
    })
    .filter(contact => {
      if (!searchQuery) return true;
      return contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }));

    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  return (
    <div className="bg-blue-50/50 rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
      <div className="flex h-full">
        {/* Contacts Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Cari chat..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveTab('providers')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'providers'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                Penyedia
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'admin'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                  activeChat === contact.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="relative">
                  <Image
                    src={contact.avatar || '/placeholder.svg'}
                    alt={contact.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  {contact.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {contact.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    contacts.find(c => c.id === activeChat)?.avatar ||
                    '/placeholder.svg?height=48&width=48'
                  }
                  alt={contacts.find(c => c.id === activeChat)?.name || ''}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium">{contacts.find(c => c.id === activeChat)?.name}</h3>
                  <p className="text-sm text-green-600">
                    {contacts.find(c => c.id === activeChat)?.status === 'online'
                      ? 'Online'
                      : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {(messages[activeChat] || []).map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === 'user'
                          ? 'bg-orange-500 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-orange-100' : 'text-gray-500'}`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t border-gray-200 flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Paperclip className="h-5 w-5 text-gray-600" />
              </button>
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="flex-1 py-2 px-4 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Mic className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={sendMessage}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Pilih percakapan</h3>
              <p className="text-gray-500">Pilih kontak untuk memulai percakapan</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
