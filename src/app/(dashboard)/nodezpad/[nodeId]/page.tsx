"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Share, Twitter, Globe, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TierData {
  totalNodes: number;
  availableNodes: number;
  pricePerNode: number;
}

interface FormData {
  nodeCardName: string;
  description: string;
  blockchainName: string;
  logoUrl: string;
  twitterLink: string;
  discordLink: string;
  websiteLink: string;
  whitepaperLink: string;
  tiers: TierData[]; // Changed from individual tiers to an array
}

export default function NodeDetailsPage() {
  const { nodeId } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nodeCardName: '',
    description: '',
    blockchainName: '',
    logoUrl: '',
    twitterLink: '',
    discordLink: '',
    websiteLink: '',
    whitepaperLink: '',
    tiers: [], // Initialize with an empty array
  });

  useEffect(() => {
    // Fetch node details using nodeId
    const fetchNodeDetails = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch(`/api/nodes/${nodeId}`);
        const data = await response.json();

        // Ensure that data.tiers is an array
        if (!Array.isArray(data.tiers)) {
          data.tiers = [];
        }

        setFormData(data);
      } catch (error) {
        console.error('Error fetching node details:', error);
      }
    };

    if (nodeId) {
      fetchNodeDetails();
    }
  }, [nodeId]);

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(
      `Check out ${formData.nodeCardName} on ${formData.blockchainName}!`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <div className="p-2 flex-1 text-white">
      <Button
        variant={'ghost'}
        className="rounded-md border border-primary/40 px-8 py-5 hover:bg-primary-foreground text-md font-semibold mb-4"
        onClick={() => router.push('/nodezpad')}
      >
        &lt; Back
      </Button>
      <div className="space-y-4 ">
        <div className="border-4 border-gray-800 rounded-3xl p-6 text-white flex flex-row items-center justify-between h-[44vh] gap-8">
          <div className="flex items-center rounded-3xl w-1/2 border-4 border-gray-800 h-full">
            <img
              src={formData.logoUrl}
              alt="Logo"
              className="w-full h-full"
            />
          </div>
          <div className="flex flex-col w-1/2 h-full gap-4">
            <div className="border-4 border-gray-800 h-[40vh] rounded-3xl p-4">
              <h2 className="text-2xl font-bold">{formData.nodeCardName}</h2>
              <span>{formData.description}</span>
            </div>
            <div className="flex justify-between h-[4vh]">
              <div className="flex flex-row justify-start items-center gap-4">
                <span className="flex text-sm ">
                  {formData.blockchainName}
                </span>
                <Button
                  onClick={shareOnTwitter}
                  className="bg-blue-400 hover:bg-blue-500"
                >
                  <Share className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>
              <div className="flex items-end gap-4">
                <a
                  href={formData.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </a>
                <a
                  href={formData.discordLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-indigo-500 hover:bg-indigo-600">
                    {/* Add your Discord icon here */}
                  </Button>
                </a>
                <a
                  href={formData.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Globe className="w-4 h-4" />
                  </Button>
                </a>
                <a
                  href={formData.whitepaperLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-gray-500 hover:bg-gray-600">
                    <FileText className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Update the tiers rendering to use the dynamic tiers array */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-4 border-gray-800">
          {formData.tiers.map((tier, index) => (
            <Card key={index} className="bg-gray-800 text-white">
              <CardHeader className="font-bold">
                Tier {index + 1}
              </CardHeader>
              <CardContent>
                <p>Total Nodes: {tier.totalNodes}</p>
                <p>Available Nodes: {tier.availableNodes}</p>
                <p>Price Per Node: ${tier.pricePerNode} USDC</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
