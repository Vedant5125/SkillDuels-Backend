/**
 * QueueManager handles the matchmaking logic.
 * It pairs users waiting in the same category.
 */
class QueueManager {
  constructor() {
    // Stores queues by category: { "Technical": [{socketId, userId}], "Aptitude": [] }
    this.queues = new Map();
  }

  /**
   * Adds a user to a specific category queue and checks for a match.
   */
  addToQueue(category, socketId, userId) {
    // Initialize category queue if it doesn't exist
    if (!this.queues.has(category)) {
      this.queues.set(category, []);
    }

    const currentQueue = this.queues.get(category);

    // Prevent duplicate entries for the same user
    const isAlreadyInQueue = currentQueue.find(user => user.userId === userId);
    if (isAlreadyInQueue) return null;

    // If there is someone waiting, pair them up
    if (currentQueue.length > 0) {
      const opponent = currentQueue.shift(); // Remove the waiting player
      console.log(`Match Found in ${category}: ${userId} vs ${opponent.userId}`);
      return opponent; // Return opponent details to trigger matchFound
    }

    // Otherwise, add the current user to the waitlist
    currentQueue.push({ socketId, userId });
    console.log(`User ${userId} joined ${category} queue. Waiting for opponent...`);
    return null;
  }

  /**
   * Removes a user from all queues (useful on disconnect).
   */
  removeFromQueue(socketId) {
    this.queues.forEach((queue, category) => {
      const updatedQueue = queue.filter(user => user.socketId !== socketId);
      this.queues.set(category, updatedQueue);
    });
  }
}

// Export as a singleton instance to maintain state across the app
export default new QueueManager();