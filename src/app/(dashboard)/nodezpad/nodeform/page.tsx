"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
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

export default function NodeFormPage() {
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
  const [showDetails, setShowDetails] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTierChange = (
    index: number,
    field: keyof TierData,
    value: string
  ) => {
    setFormData((prevData) => {
      const updatedTiers = [...prevData.tiers];
      const existingTier = updatedTiers[index] || {
        totalNodes: 100,
        availableNodes: 0,
        pricePerNode: 0,
      } as TierData;

      const updatedTier: TierData = {
        totalNodes: existingTier.totalNodes,
        availableNodes: existingTier.availableNodes,
        pricePerNode: existingTier.pricePerNode,
        [field]: value === '' ? 0 : Number(value),
      };

      updatedTiers[index] = updatedTier;
      return {
        ...prevData,
        tiers: updatedTiers,
      };
    });
  };

  const addTier = () => {
    setFormData((prevData) => ({
      ...prevData,
      tiers: [
        ...prevData.tiers,
        { totalNodes: 100, availableNodes: 0, pricePerNode: 0 },
      ],
    }));
  };

  const removeTier = (index: number) => {
    setFormData((prevData) => {
      const updatedTiers = [...prevData.tiers];
      updatedTiers.splice(index, 1);
      return {
        ...prevData,
        tiers: updatedTiers,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDetails(true);
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(
      `Check out ${formData.nodeCardName} on ${formData.blockchainName}!`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <div className="flex-1 p-4">
      <Button
        variant={'ghost'}
        className="rounded-md border border-primary/40 px-8 py-5 hover:bg-primary-foreground text-md font-semibold mb-4"
        onClick={() => router.push('/nodezpad')}
      >
        &lt; Back
      </Button>
      {!showDetails ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="nodeCardName"
            placeholder="Node Name"
            value={formData.nodeCardName}
            onChange={handleInputChange}
          />
          <Input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="logoUrl"
              placeholder="Logo URL"
              value={formData.logoUrl}
              onChange={handleInputChange}
            />
            <Input
              name="blockchainName"
              placeholder="Blockchain Name"
              value={formData.blockchainName}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              name="twitterLink"
              placeholder="Twitter Link"
              value={formData.twitterLink}
              onChange={handleInputChange}
            />
            <Input
              name="discordLink"
              placeholder="Discord Link"
              value={formData.discordLink}
              onChange={handleInputChange}
            />
            <Input
              name="websiteLink"
              placeholder="Website Link"
              value={formData.websiteLink}
              onChange={handleInputChange}
            />
            <Input
              name="whitepaperLink"
              placeholder="Whitepaper Link"
              value={formData.whitepaperLink}
              onChange={handleInputChange}
            />
          </div>

          {/* Add Tier Button */}
          <Button type="button" onClick={addTier}>
            Add Tier
          </Button>

          {/* Dynamic Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.tiers.map((tier, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-semibold">Tier {index + 1}</h3>
                <Input
                  placeholder="Available Nodes"
                  value={tier.availableNodes}
                  onChange={(e) =>
                    handleTierChange(index, 'availableNodes', e.target.value)
                  }
                />
                <Input
                  placeholder="Price Per Node"
                  value={tier.pricePerNode}
                  onChange={(e) =>
                    handleTierChange(index, 'pricePerNode', e.target.value)
                  }
                />
                {/* Remove Tier Button */}
                <Button type="button" onClick={() => removeTier(index)}>
                  Remove Tier
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-purple-900 rounded-lg p-6 text-white flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={formData.logoUrl}
                alt="Logo"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold">{formData.nodeCardName}</h2>
                <p>{formData.description}</p>
                <p className="text-sm">{formData.blockchainName}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={shareOnTwitter}
                className="bg-blue-400 hover:bg-blue-500"
              >
                <Share className="w-4 h-4 mr-2" /> Share
              </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <Button onClick={() => setShowDetails(false)}>Edit</Button>
        </div>
      )}
    </div>
  );
}
