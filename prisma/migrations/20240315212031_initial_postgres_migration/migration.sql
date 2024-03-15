-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('MARATHON', 'ELIMINATION', 'SURVIVAL');

-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('MARATHON', 'ELIMINATION', 'OTHER');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "hasUpgraded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Lobby" (
    "id" TEXT NOT NULL,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "gameType" "GameType" NOT NULL,
    "bot" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT,
    "passkey" TEXT,
    "name" TEXT,

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Players" (
    "userId" TEXT NOT NULL,
    "lobbyId" TEXT NOT NULL,
    "qualified" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Issues" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "issueType" "IssueType" NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "Issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_ownerId_key" ON "Lobby"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Players_userId_key" ON "Players"("userId");

-- CreateIndex
CREATE INDEX "Players_lobbyId_idx" ON "Players"("lobbyId");

-- CreateIndex
CREATE INDEX "Issues_createdById_idx" ON "Issues"("createdById");
