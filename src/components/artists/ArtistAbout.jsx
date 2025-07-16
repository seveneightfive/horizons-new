import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ArtistAbout = ({ bio }) => (
    <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
        <Card className="bg-white shadow-lg border-slate-100">
            <CardHeader>
                <CardTitle className="text-3xl uppercase tracking-wide">About</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-600 leading-relaxed text-lg font-sans">
                    {bio}
                </p>
            </CardContent>
        </Card>
    </motion.div>
);

export default ArtistAbout;