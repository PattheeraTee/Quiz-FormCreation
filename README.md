# คู่มือการติดตั้งและใช้งานระบบสร้างแบบทดสอบ (Quiz Creation)

## ข้อกำหนดเบื้องต้น
- ติดตั้ง **Node.js** (แนะนำเวอร์ชันล่าสุด)
- ติดตั้ง **Docker** และ **Docker Compose**

---

## ขั้นตอนการติดตั้งและใช้งาน

### 1. การตั้งค่า Backend
1. เปิด Terminal และเข้าสู่โฟลเดอร์ `QuizCreation_Backend`:
    ```bash
    cd QuizCreation_Backend
    ```

2. ติดตั้ง Dependencies:
    ```bash
    npm i
    ```

3. ตรวจสอบและแก้ไขช่องโหว่ (ถ้ามี):
    ```bash
    npm audit fix
    ```

4. สร้างและรันคอนเทนเนอร์ MongoDB ด้วย Docker:
    ```bash
    cd docker
    docker compose up -d mongo6
    cd ..
    ```

5. ติดตั้งไลบรารีเพิ่มเติมสำหรับ Backend:
    ```bash
    npm install express @prisma/client
    ```

6. สร้าง Prisma Client:
    ```bash
    npx prisma generate
    ```

7. เริ่มรันเซิร์ฟเวอร์ Backend:
    ```bash
    nodemon app.js
    ```
    ระบบจะพร้อมใช้งานที่พอร์ต `3001`

---

### 2. การตั้งค่า Frontend
1. เปิด Terminal ใหม่ และเข้าสู่โฟลเดอร์ `frontend-createquiz`:
    ```bash
    cd frontend-createquiz
    ```

2. ติดตั้ง Dependencies:
    ```bash
    npm i
    ```

3. ตรวจสอบและแก้ไขช่องโหว่ (ถ้ามี):
    ```bash
    npm audit fix
    ```

4. รันเซิร์ฟเวอร์ Frontend:
    ```bash
    npm run dev
    ```
    ระบบจะพร้อมใช้งานที่ `http://localhost:3000`

---

## การใช้งาน
1. เปิดเบราว์เซอร์และเข้า URL:
    - **Frontend:** [http://localhost:3000](http://localhost:3000)
    - **Backend API:** [http://localhost:3001](http://localhost:3001)

2. เริ่มสร้างแบบทดสอบหรือใช้งานฟังก์ชันที่ต้องการผ่านหน้าจอ Frontend

---

## หมายเหตุ
- หากมีการเปลี่ยนแปลงใน Prisma Schema โปรดรันคำสั่ง `npx prisma generate` อีกครั้ง
- หากต้องการหยุดคอนเทนเนอร์ MongoDB ใช้คำสั่ง:
    ```bash
    docker compose down
    ``` 

---

## ข้อมูลเพิ่มเติม
- หากพบปัญหาเกี่ยวกับเวอร์ชัน Prisma ให้ตรวจสอบและอัปเดตแพ็กเกจ:
    ```bash
    npm install prisma@5.22.0 @prisma/client@5.22.0
    ```
