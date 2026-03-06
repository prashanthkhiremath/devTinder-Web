import { motion, useAnimation } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

function Feed() {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const controls = useAnimation();
  const [loading, setLoading] = useState(false);

  // 1. Fetching Logic
  const getFeed = async () => {
    // Only fetch if feed is empty
    if (feed && feed.length > 0) return;

    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // 2. Request Logic (Like/Ignore)
  const handleRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
      // Remove the top user so the next one in the array moves to index 0
      dispatch(removeUserFromFeed(userId));

      // Reset position for the next card
      controls.set({ x: 0, opacity: 1, rotate: 0 });
    } catch (err) {
      console.error("Request failed:", err);
      // If API fails, snap the card back so user can try again
      controls.start({ x: 0, opacity: 1, rotate: 0 });
    }
  };

  // 3. Gesture Logic
  const onDragEnd = async (event, info, userId) => {
    const threshold = 130; // Distance in pixels to trigger swipe

    if (info.offset.x > threshold) {
      // SWIPE RIGHT (Interested)
      await controls.start({ x: 600, opacity: 0, rotate: 20 });
      handleRequest("interested", userId);
    } else if (info.offset.x < -threshold) {
      // SWIPE LEFT (Ignored)
      await controls.start({ x: -600, opacity: 0, rotate: -20 });
      handleRequest("ignored", userId);
    } else {
      // SNAP BACK (User didn't drag far enough)
      controls.start({ x: 0, opacity: 1, rotate: 0 });
    }
  };

  // 4. Conditional Rendering
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h1 className="text-3xl font-bold opacity-20 mb-4">
          No New Developers Found
        </h1>
        <button className="btn btn-primary btn-outline" onClick={getFeed}>
          Refresh Feed
        </button>
      </div>
    );
  }

  const topUser = feed[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] overflow-hidden relative">
      <div className="relative w-full max-w-sm flex justify-center">
        {/* The Card with Framer Motion Gestures */}
        <motion.div
          key={topUser._id} // Key ensures fresh animation for every new user
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          animate={controls}
          onDragEnd={(e, info) => onDragEnd(e, info, topUser._id)}
          whileDrag={{ scale: 1.05, rotate: 2 }}
          className="cursor-grab active:cursor-grabbing z-10"
        >
          <UserCard user={topUser} showButtons={false} />
        </motion.div>

        {/* Visual Guides (Static background indicators) */}
        <div className="absolute inset-0 flex justify-between items-center px-10 pointer-events-none opacity-5">
          <div className="text-8xl font-black text-error -rotate-12">NO</div>
          <div className="text-8xl font-black text-success rotate-12">YES</div>
        </div>
      </div>

      <div className="mt-8 text-xs font-bold uppercase tracking-widest opacity-20 md:block hidden">
        Drag Right to Like • Drag Left to Pass
      </div>
    </div>
  );
}

export default Feed;
