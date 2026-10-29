-- CreateTable
CREATE TABLE "StudentProctorAssignment" (
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentProctorAssignment_pkey" PRIMARY KEY ("studentId")
);

-- CreateIndex
CREATE INDEX "StudentProctorAssignment_teacherId_idx" ON "StudentProctorAssignment"("teacherId");

-- AddForeignKey
ALTER TABLE "StudentProctorAssignment" ADD CONSTRAINT "StudentProctorAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProctorAssignment" ADD CONSTRAINT "StudentProctorAssignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
