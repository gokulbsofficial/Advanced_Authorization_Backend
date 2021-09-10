import { IUser } from "./interfaces/userInterfaces";
import { IAdmin } from "./interfaces/adminInterface";

export const UsersData: IUser[] = [
  {
    name: "User_1",
    email: "user1@example.com",
    password: "User_1",
    methods: ["Password"],
    twoStepVerification: false,
    accountStatus: {
      status: "Active",
    },
    accountLogs: {
      createdAt: new Date(),
      lastSync: new Date(),
    },
    accountDetails: {
      resetPasswdAccess: false,
    },
  },
  {
    name: "User_2",
    email: "user2@example.com",
    password: "User_2",
    methods: ["Password"],
    twoStepVerification: false,
    accountStatus: {
      status: "Blocked",
      blockedCount: 1,
      blockedType: "Temporarily",
      blockedUntil: new Date(new Date().getTime() + 30 * 60 * 1000),
      blockedreason: ["Spam issue"],
    },
    accountLogs: {
      createdAt: new Date(),
      lastSync: new Date(),
    },
    accountDetails: {
      resetPasswdAccess: false,
    },
  },
  {
    name: "User_3",
    email: "user3@example.com",
    password: "User_3",
    methods: ["Password"],
    twoStepVerification: false,
    accountStatus: {
      status: "Blocked",
      blockedCount: 1,
      blockedType: "Permanently",
      blockedreason: ["Hacked issue"],
    },
    accountLogs: {
      createdAt: new Date(),
      lastSync: new Date(),
    },
    accountDetails: {
      resetPasswdAccess: false,
    },
  },
];

export const AdminsData: IAdmin[] = [
  {
    name: "SuperAdmin",
    email: "SuperAdmin@example.com",
    role: "SUPER_ADMIN",
    password: "SuperAdmin",
    twoStepVerification: false,
    accountStatus: {
      status: "Active",
    },
    accountLogs: {
      createdAt: new Date(),
      lastSync: new Date(),
    },
    accountDetails: {
      resetPasswdAccess: false,
    },
  },
  {
    name: "Admin_1",
    email: "admin1@example.com",
    role: "ADMIN",
    password: "Admin_1",
    twoStepVerification: false,
    accountStatus: {
      status: "Active",
    },
    accountLogs: {
      createdAt: new Date(),
      lastSync: new Date(),
    },
    accountDetails: {
      resetPasswdAccess: false,
    },
  },
  {
    name: "Admin_2",
    email: "admin2@example.com",
    role: "ADMIN",
    password: "Admin_2",
    twoStepVerification: false,
    accountStatus: {
      status: "Blocked",
      blockedCount: 1,
      blockedType: "Temporarily",
      blockedUntil: new Date(new Date().getTime() + 30 * 60 * 1000),
      blockedreason: ["Spam issue"],
    },
    accountLogs: {
      createdAt: new Date(),
      lastSync: new Date(),
    },
    accountDetails: {
      resetPasswdAccess: false,
    },
  },
  {
    name: "Admin_3",
    email: "admin3@example.com",
    role: "ADMIN",
    password: "Admin_3",
    twoStepVerification: false,
    accountStatus: {
      status: "Blocked",
      blockedCount: 1,
      blockedType: "Permanently",
      blockedreason: ["Hacked issue"],
    },
    accountLogs: {
      createdAt: new Date(),
      lastSync: new Date(),
    },
    accountDetails: {
      resetPasswdAccess: false,
    },
  },
];
