"use client"

import type React from "react"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Review {
  id: number
  user: string
  avatar?: string
  rating: number
  date: string
  comment: string
  helpful: number
  notHelpful: number
}

const mockReviews: Review[] = [
  {
    id: 1,
    user: "Priya S.",
    avatar: "/avatars/priya.jpg",
    rating: 5,
    date: "2023-04-15",
    comment:
      "This perfume is absolutely amazing! The scent lasts all day and I've received so many compliments. Will definitely purchase again.",
    helpful: 24,
    notHelpful: 2,
  },
  {
    id: 2,
    user: "Rahul M.",
    avatar: "/avatars/rahul.jpg",
    rating: 4,
    date: "2023-03-28",
    comment:
      "Great fragrance with good longevity. The only reason I'm giving 4 stars instead of 5 is because the bottle design could be improved.",
    helpful: 18,
    notHelpful: 3,
  },
  {
    id: 3,
    user: "Ananya K.",
    rating: 5,
    date: "2023-05-02",
    comment:
      "I'm in love with this scent! It's perfect for both day and evening wear. The packaging is also very elegant.",
    helpful: 32,
    notHelpful: 1,
  },
  {
    id: 4,
    user: "Vikram J.",
    avatar: "/avatars/vikram.jpg",
    rating: 3,
    date: "2023-02-19",
    comment: "The fragrance is nice but doesn't last as long as I expected. I need to reapply after about 4 hours.",
    helpful: 15,
    notHelpful: 7,
  },
]

interface ProductReviewsProps {
  productId: number
  productName: string
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("newest")
  const [helpfulClicked, setHelpfulClicked] = useState<Record<number, boolean>>({})
  const [notHelpfulClicked, setNotHelpfulClicked] = useState<Record<number, boolean>>({})

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true
    if (filter === "positive" && review.rating >= 4) return true
    if (filter === "negative" && review.rating < 4) return true
    return false
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime()
    if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
    if (sort === "highest") return b.rating - a.rating
    if (sort === "lowest") return a.rating - b.rating
    if (sort === "most-helpful") return b.helpful - a.helpful
    return 0
  })

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview({ ...newReview, comment: e.target.value })
  }

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) return

    const newReviewObj: Review = {
      id: reviews.length + 1,
      user: "You",
      rating: newReview.rating,
      date: new Date().toISOString().split("T")[0],
      comment: newReview.comment,
      helpful: 0,
      notHelpful: 0,
    }

    setReviews([newReviewObj, ...reviews])
    setNewReview({ rating: 5, comment: "" })
  }

  const handleHelpful = (reviewId: number) => {
    if (helpfulClicked[reviewId]) return

    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review)))

    setHelpfulClicked({ ...helpfulClicked, [reviewId]: true })

    // If not helpful was clicked before, remove that vote
    if (notHelpfulClicked[reviewId]) {
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, notHelpful: Math.max(0, review.notHelpful - 1) } : review,
        ),
      )
      setNotHelpfulClicked({ ...notHelpfulClicked, [reviewId]: false })
    }
  }

  const handleNotHelpful = (reviewId: number) => {
    if (notHelpfulClicked[reviewId]) return

    setReviews(
      reviews.map((review) => (review.id === reviewId ? { ...review, notHelpful: review.notHelpful + 1 } : review)),
    )

    setNotHelpfulClicked({ ...notHelpfulClicked, [reviewId]: true })

    // If helpful was clicked before, remove that vote
    if (helpfulClicked[reviewId]) {
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, helpful: Math.max(0, review.helpful - 1) } : review,
        ),
      )
      setHelpfulClicked({ ...helpfulClicked, [reviewId]: false })
    }
  }

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="text-4xl font-bold mr-2">{averageRating.toFixed(1)}</div>
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on {reviews.length} reviews</div>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length
              const percentage = (count / reviews.length) * 100

              return (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-12">
                    <span>{rating}</span>
                    <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                  </div>
                  <div className="w-8 text-xs text-gray-500 dark:text-gray-400">{count}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

            <div className="mb-4">
              <div className="text-sm mb-2">Your Rating</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRatingChange(star)} className="focus:outline-none">
                    <Star
                      className={`h-6 w-6 ${
                        star <= newReview.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm mb-2">Your Review</div>
              <Textarea
                value={newReview.comment}
                onChange={handleCommentChange}
                placeholder={`What did you think about ${productName}?`}
                className="min-h-[100px]"
              />
            </div>

            <Button onClick={handleSubmitReview} disabled={!newReview.comment.trim()}>
              Submit Review
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Filter:</div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "all"
                  ? "bg-accent text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("positive")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "positive"
                  ? "bg-accent text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              Positive
            </button>
            <button
              onClick={() => setFilter("negative")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "negative"
                  ? "bg-accent text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              Critical
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">Sort by:</div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="most-helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No reviews match your filter criteria.
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={review.avatar} alt={review.user} />
                    <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{review.user}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="mr-6">Was this review helpful?</div>

                <button
                  onClick={() => handleHelpful(review.id)}
                  className={`flex items-center mr-4 ${helpfulClicked[review.id] ? "text-green-500" : ""}`}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{review.helpful}</span>
                </button>

                <button
                  onClick={() => handleNotHelpful(review.id)}
                  className={`flex items-center ${notHelpfulClicked[review.id] ? "text-red-500" : ""}`}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  <span>{review.notHelpful}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {sortedReviews.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  )
}
