"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gift, Award, TrendingUp, CreditCard, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function LoyaltyProgram() {
  const [points, setPoints] = useState(350)
  const [tier, setTier] = useState("Silver")
  const [isOpen, setIsOpen] = useState(false)

  const nextTier = tier === "Silver" ? "Gold" : tier === "Gold" ? "Platinum" : "Diamond"
  const pointsToNextTier = tier === "Silver" ? 650 : tier === "Gold" ? 1500 : 3000
  const progress = (points / (points + pointsToNextTier)) * 100

  const rewards = [
    {
      id: 1,
      name: "10% Off Coupon",
      points: 200,
      description: "Get 10% off on your next purchase",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: 2,
      name: "Free Sample",
      points: 300,
      description: "Redeem a free sample with your next order",
      icon: <Gift className="h-5 w-5" />,
    },
    {
      id: 3,
      name: "Free Shipping",
      points: 500,
      description: "Get free shipping on your next order",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      id: 4,
      name: "Exclusive Perfume",
      points: 1000,
      description: "Redeem an exclusive perfume not available for purchase",
      icon: <Award className="h-5 w-5" />,
    },
  ]

  const redeemReward = (rewardId: number, pointsCost: number) => {
    if (points >= pointsCost) {
      setPoints(points - pointsCost)
      alert(`Reward redeemed! Check your email for details.`)
    }
  }

  return (
    <div className="py-8">
      <div
        className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-white mr-3" />
            <div>
              <h3 className="text-xl font-bold text-white">Vave Rewards</h3>
              <p className="text-white/80">You have {points} points</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">{tier} Member</div>
            <div className="text-white/80 text-sm">
              {pointsToNextTier} points to {nextTier}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">How to Earn Points</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <ShoppingBag className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <div className="font-medium">Make a Purchase</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Earn 1 point for every Rs. 10 spent</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Award className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <div className="font-medium">Write a Review</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Earn 50 points for each product review
                    </div>
                  </div>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <div className="font-medium">Refer a Friend</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Earn 200 points when your friend makes their first purchase
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Membership Benefits</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3 text-xs font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-medium">Silver (0-1,000 points)</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Birthday gift, exclusive offers</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center mr-3 text-xs font-bold text-white">
                    G
                  </div>
                  <div>
                    <div className="font-medium">Gold (1,000-2,500 points)</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Silver benefits + free shipping, early access to sales
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3 text-xs font-bold text-white">
                    P
                  </div>
                  <div>
                    <div className="font-medium">Platinum (2,500-5,000 points)</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Gold benefits + free samples with every order, exclusive events
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-xs font-bold text-white">
                    D
                  </div>
                  <div>
                    <div className="font-medium">Diamond (5,000+ points)</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Platinum benefits + personal shopping assistant, custom fragrances
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Available Rewards</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rewards.map((reward) => (
                <div key={reward.id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2 text-purple-600 dark:text-purple-300">
                      {reward.icon}
                    </div>
                    <h5 className="font-medium">{reward.name}</h5>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">{reward.points} points</div>
                    <Button
                      size="sm"
                      variant={points >= reward.points ? "default" : "outline"}
                      disabled={points < reward.points}
                      onClick={() => redeemReward(reward.id, reward.points)}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
