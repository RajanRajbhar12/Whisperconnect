import { 
  InsertActiveUser, 
  ActiveUser, 
  InsertMatch, 
  Match, 
  Mood, 
  User, 
  InsertUser 
} from "@shared/schema";

// Storage interface for the application
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Active user methods
  createActiveUser(activeUser: InsertActiveUser): Promise<ActiveUser>;
  getActiveUser(socketId: string): Promise<ActiveUser | undefined>;
  getActiveUsersByMood(mood: Mood): Promise<ActiveUser[]>;
  updateActiveUserMatchStatus(socketId: string, isMatched: boolean): Promise<void>;
  removeActiveUser(socketId: string): Promise<void>;
  
  // Match methods
  createMatch(match: InsertMatch): Promise<Match>;
  getMatch(id: number): Promise<Match | undefined>;
  getMatchByUserSocketId(socketId: string): Promise<Match | undefined>;
  updateMatchEndTime(id: number): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activeUsers: Map<string, ActiveUser>;
  private matches: Map<number, Match>;
  
  private currentUserId: number = 1;
  private currentActiveUserId: number = 1;
  private currentMatchId: number = 1;

  constructor() {
    this.users = new Map();
    this.activeUsers = new Map();
    this.matches = new Map();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Active user methods
  async createActiveUser(activeUser: InsertActiveUser): Promise<ActiveUser> {
    const id = this.currentActiveUserId++;
    const timestamp = new Date();
    const newActiveUser: ActiveUser = {
      ...activeUser,
      id,
      createdAt: timestamp,
      isMatched: false
    };
    this.activeUsers.set(activeUser.socketId, newActiveUser);
    return newActiveUser;
  }

  async getActiveUser(socketId: string): Promise<ActiveUser | undefined> {
    return this.activeUsers.get(socketId);
  }

  async getActiveUsersByMood(mood: Mood): Promise<ActiveUser[]> {
    return Array.from(this.activeUsers.values()).filter(
      (user) => user.mood === mood && !user.isMatched
    );
  }

  async updateActiveUserMatchStatus(socketId: string, isMatched: boolean): Promise<void> {
    const user = this.activeUsers.get(socketId);
    if (user) {
      user.isMatched = isMatched;
      this.activeUsers.set(socketId, user);
    }
  }

  async removeActiveUser(socketId: string): Promise<void> {
    this.activeUsers.delete(socketId);
  }

  // Match methods
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.currentMatchId++;
    const timestamp = new Date();
    const newMatch: Match = {
      ...match,
      id,
      createdAt: timestamp,
      endedAt: null
    };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchByUserSocketId(socketId: string): Promise<Match | undefined> {
    return Array.from(this.matches.values()).find(
      (match) => match.user1Id === socketId || match.user2Id === socketId
    );
  }

  async updateMatchEndTime(id: number): Promise<void> {
    const match = this.matches.get(id);
    if (match) {
      match.endedAt = new Date();
      this.matches.set(id, match);
    }
  }
}

// Export a single instance of the storage
export const storage = new MemStorage();
