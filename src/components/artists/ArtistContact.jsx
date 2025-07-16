import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Globe } from 'lucide-react';

const ArtistContact = ({ artist }) => {
    const { contact, website } = artist;

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
            <Card className="bg-white shadow-lg border-slate-100">
                <CardHeader>
                    <CardTitle className="text-3xl uppercase tracking-wide">Contact & Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {contact?.email && (
                         <div className="flex items-center gap-3 text-slate-700">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <a href={`mailto:${contact.email}`} className="hover:underline break-all">{contact.email}</a>
                        </div>
                    )}
                    {contact?.phone && (
                         <div className="flex items-center gap-3 text-slate-700">
                            <Phone className="w-5 h-5 text-slate-400" />
                            <span>{contact.phone}</span>
                        </div>
                    )}
                    {website && (
                         <div className="flex items-center gap-3 text-slate-700">
                            <Globe className="w-5 h-5 text-slate-400" />
                            <a href={website} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{website}</a>
                        </div>
                    )}
                    {!contact?.email && !contact?.phone && !website && (
                        <p className="text-slate-500">No contact information available.</p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ArtistContact;