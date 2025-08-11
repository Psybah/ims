# File Management System API Documentation

## Table of Contents

- [Authentication](#authentication)
  - [Register Account](#register-account)
  - [Login](#login)
- [Security Groups](#security-groups)
  - [Create Security Group](#create-security-group)
  - [Get All Security Groups](#get-all-security-groups)
  - [Update Security Group](#update-security-group)
  - [Add Users to Group](#add-users-to-group)
  - [Get Users in Group](#get-users-in-group)
- [User Management](#user-management)
  - [Get All Users](#get-all-users)
  - [Admin Dashboard Analytics](#admin-dashboard-analytics)
  - [Member Dashboard Analytics](#member-dashboard-analytics)
  - [Create Admin & Member Account](#create-admin--member-account)
- [Files and Folders](#files-and-folders)
  - [Create Folder](#create-folder)
  - [Create Subfolder](#create-subfolder)
  - [Upload File to Root](#upload-file-to-root)
  - [Upload File to Folder](#upload-file-to-folder)
  - [Get Folders](#get-folders)
  - [Get Folder by ID](#get-folder-by-id)
  - [Get File by ID](#get-file-by-id)
  - [Delete File](#delete-file)
  - [Upload Folders](#upload-folders)
- [Trash Management](#trash-management)
  - [Get All Trash](#get-all-trash)
  - [Get Trash Analysis](#get-trash-analysis)
  - [Restore Deleted Item](#restore-deleted-item)

---

## Authentication

### Register Account

Creates a new user account in the system.

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**```json
{
    "fullName": "Meghan O'Conner",
    "phoneNumber": "14-930-290-6636",
    "email": "superAdmin454@gmail.com",
    "password": "ossigma125#@"
}
```

**Example Request:**
```bash
curl --location 'localhost:3004/api/v1/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "fullName": "Miriam Wisozk",
    "phoneNumber": "30-619-351-6802",
    "email": "emosescode@gmail.com",
    "password": "ossigma123"
}'
```

**Response (200 OK):**
```json
{
  "data": {
    "user": {
      "id": "b999cac7-7b22-4280-a795-bdb0f87aae87",
      "fullName": "Kari Sawayn",
      "email": "emosescode@gmail.com",
      "phoneNumber": "64-473-497-7904",
      "role": "ADMIN",
      "createdAt": "2025-05-18T16:55:30.744Z",
      "updatedAt": "2025-05-18T16:55:30.744Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI5OTljYWM3LTdiMjItNDI4MC1hNzk1LWJkYjBmODdhYWU4NyIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NzU4NzMzMCwiZXhwIjoxNzQ3Njc3NzMwfQ.vPXLS-LKW2A8f-i2I2uVZYBChBZ0OTsBZFANZj_Wmt0"
  },
  "message": "Account Created successful"
}
```

### Login

Authenticates a user and returns an access token.

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
    "email": "superAdmin45@gmail.com",
    "password": "ossigma125#@"
}
```

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "superAdmin@gmail.com",
    "password": "ossigma123"
}'
```

**Response (200 OK):**
```json
{
  "data": {
    "user": {
      "id": "b63e7523-5a91-458f-ad27-f6da32b95aef",
      "fullName": "Kenneth Sporer",
      "email": "superAdmin@gmail.com",
      "phoneNumber": "38-580-652-2660",
      "role": "SUPER_ADMIN",
      "createdAt": "2025-05-18T17:30:14.778Z",
      "updatedAt": "2025-05-18T17:30:14.778Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI2M2U3NTIzLTVhOTEtNDU4Zi1hZDI3LWY2ZGEzMmI5NWFlZiIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc0NzU5MDAwOCwiZXhwIjoxNzQ3Njc2NDA4fQ.ZLb38P2LNQU8heBOtopam2i3ZoekGL2EGjHvPw1zMSo"
  },
  "message": "Login successful"
}
```

---

## Security Groups

### Create Security Group

Creates a new security group for organizing users.

**Endpoint:** `POST /api/v1/security-group`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
    "name": "Audit Department",
    "description": "The Audit Department group"
}
```

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v1/security-group' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Engineering Department",
    "description": "The engineering Department group"
}'
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Security group created successfully",
  "data": {
    "securityGroup": {
      "id": "85cd6c9f-e8dd-4978-91cc-e96e3a77aefc",
      "name": "Engineering Department",
      "description": "The engineering Department group",
      "createdAt": "2025-05-19T15:55:01.444Z",
      "updatedAt": "2025-05-19T15:55:01.444Z"
    }
  }
}
```

### Get All Security Groups

Retrieves all security groups with their members and ACLs.

**Endpoint:** `GET /api/v1/security-group`

**Headers:**
- `Authorization: Bearer <token>`

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v1/security-group' \
--header 'Authorization: Bearer <token>'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "securityGroups": [
      {
        "id": "85cd6c9f-e8dd-4978-91cc-e96e3a77aefc",
        "name": "Engineering Department",
        "description": "The engineering Department group",
        "createdAt": "2025-05-19T15:55:01.444Z",
        "updatedAt": "2025-05-19T15:55:01.444Z",
        "members": [],
        "acls": []
      },
      {
        "id": "9b6e7dd8-1636-4125-b9f9-e68b305afe01",
        "name": "Audit Department",
        "description": "The Audit Department group",
        "createdAt": "2025-05-19T15:58:17.008Z",
        "updatedAt": "2025-05-19T15:58:17.008Z",
        "members": [
          {
            "id": "d9684682-75db-4970-91da-c09832e8618a",
            "groupId": "9b6e7dd8-1636-4125-b9f9-e68b305afe01",
            "accountId": "f0ad3242-85e4-4a58-a2cf-979b409b3d56",
            "joinedAt": "2025-05-19T16:41:24.809Z"
          }
        ],
        "acls": []
      }
    ]
  }
}
```

### Update Security Group

Updates an existing security group's information.

**Endpoint:** `PATCH /api/v1/security-group/{groupId}`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
    "name": "Electronics",
    "description": "incremental"
}
```

**Example Request:**
```bash
curl --location --request PATCH 'https://api.yareyare.com/api/v1/security-group/{groupId}' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Health",
    "description": "transitional"
}'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Security group updated successfully",
  "data": {
    "securityGroup": {
      "id": "9b6e7dd8-1636-4125-b9f9-e68b305afe01",
      "name": "Sports",
      "description": "responsive",
      "createdAt": "2025-05-19T15:58:17.008Z",
      "updatedAt": "2025-05-19T17:27:08.196Z"
    }
  }
}
```

### Add Users to Group

Adds one or more users to a security group.

**Endpoint:** `POST /api/v1/security-group/{groupId}/add-user`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
    "userIds": ["b4886cfd-f75b-486a-a10e-992c0094a1d8"]
}
```

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v1/security-group/{groupId}/add-user' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "userIds": ["6981c373-621d-45b9-af53-0eeb80558b02"]
}'
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "User added to security group successfully",
  "data": {
    "user": {
      "results": [],
      "errors": [
        {
          "name": "Craig Padberg",
          "message": "User already in group",
          "statusCode": 409
        }
      ],
      "success": 0,
      "failed": 1
    }
  }
}
```

### Get Users in Group

Retrieves all users belonging to a specific security group.

**Endpoint:** `GET /api/v1/security-group/{groupId}/users`

**Headers:**
- `Authorization: Bearer <token>`

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v1/security-group/{groupId}/users' \
--header 'Authorization: Bearer <token>'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "9dec0c1f-3dc6-46f4-b946-ee2477369333",
        "groupId": "44b5a553-601e-4e07-946e-1cf09f352078",
        "accountId": "f96b5032-7e82-4f44-849f-f7c767ef573e",
        "joinedAt": "2025-05-29T23:32:41.580Z",
        "account": {
          "id": "f96b5032-7e82-4f44-849f-f7c767ef573e",
          "fullName": "Felipe Nikolaus V",
          "email": "Dessie_Heathcote@yahoo.com",
          "phoneNumber": null,
          "role": "MEMBER",
          "createdAt": "2025-05-29T23:32:21.819Z",
          "updatedAt": "2025-05-29T23:32:21.819Z"
        }
      }
    ]
  }
}
```

---

## User Management

### Get All Users

Retrieves a list of all users in the system.

**Endpoint:** `GET /api/v1/users`

**Headers:**
- `Authorization: Bearer <token>`

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v1/users' \
--header 'Authorization: Bearer <token>'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "e1117d02-edfb-4f23-998a-7e0712cf2e58",
        "fullName": "Ismael Kuhn",
        "email": "superAdmin@gmail.com",
        "phoneNumber": "84-576-800-6874",
        "role": "SUPER_ADMIN",
        "createdAt": "2025-05-21T14:21:44.918Z",
        "updatedAt": "2025-05-21T14:21:44.918Z"
      },
      {
        "id": "b4881e6b-f709-4003-8250-a9912d596c43",
        "fullName": "Eteng Moses Efa",
        "email": "abdullah3@gmail.com",
        "phoneNumber": "09070307937",
        "role": "SUPER_ADMIN",
        "createdAt": "2025-05-21T14:32:37.635Z",
        "updatedAt": "2025-05-21T14:32:37.635Z"
      },
      {
        "id": "3bb836d6-eb3e-4bf9-988b-727a0ac7b3f0",
        "fullName": "Angela Gleason",
        "email": "superAdmin1@gmail.com",
        "phoneNumber": "68-415-227-7412",
        "role": "SUPER_ADMIN",
        "createdAt": "2025-05-21T14:36:48.143Z",
        "updatedAt": "2025-05-21T14:36:48.143Z"
      }
    ]
  }
}
```

### Admin Dashboard Analytics

Retrieves analytics data for the admin dashboard.

**Endpoint:** `GET /api/v1/users/admin/dashboard`

**Headers:**
- `Authorization: Bearer <token>`

**Example Request:**
```bash
curl --location --request GET 'https://api.yareyare.com/api/v1/users/admin/dashboard' \
--header 'Authorization: Bearer <token>'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "totalUsers": 3,
    "totalFiles": {
      "totalFiles": 4,
      "totalSize": 5015
    }
  }
}
```

### Member Dashboard Analytics

Retrieves analytics data for the member dashboard.

**Endpoint:** `GET /api/v1/users/member/dashboard`

**Headers:**
- `Authorization: Bearer <token>`

**Example Request:**
```bash
curl --location --request GET 'https://api.yareyare.com/api/v1/users/member/dashboard' \
--header 'Authorization: Bearer <token>'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "totalFiles": 0,
    "fileTypes": {
      "images": 0,
      "videos": 0,
      "documents": 0,
      "others": 0
    },
    "totalSize": 0
  }
}
```

### Create Admin & Member Account

Creates a new admin or member account (requires admin privileges).

**Endpoint:** `POST /api/v1/users/add-user`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
    "fullName": "Ms. Glen Nicolas",
    "password": "ossigma125#@",
    "phoneNumber": "80-210-998-6794",
    "email": "iammoses19@gmail.com",
    "role": "ADMIN"
}
```

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v1/users/add-user' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "fullName": "Raquel Brekke",
    "password": "ossigma125#@",
    "phoneNumber": "17-788-616-7691",
    "email": "Lenore_Borer@gmail.com",
    "role": "ADMIN"
}'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Member created successfully",
  "data": {
    "member": {
      "id": "db2c6859-d3c2-4cc1-bc65-44190cd820be",
      "fullName": "Gail Zboncak",
      "email": "Athena_Carroll59@gmail.com",
      "phoneNumber": null,
      "role": "ADMIN",
      "createdAt": "2025-05-18T20:30:30.616Z",
      "updatedAt": "2025-05-18T20:30:30.616Z"
    }
  }
}
```

---

## Files and Folders

### Create Folder

Creates a new folder in the root directory.

**Endpoint:** `POST /api/v2/files/create/folder`

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `resourceType=FOLDER`

**Request Body:**
```json
{
    "folderName": "Testing Folder 7"
}
```

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v2/files/create/folder?resourceType=FOLDER' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "folderName": "New Foldersa"
}'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Folder created successfully",
  "data": {
    "folder": {
      "id": "18gXRCd8mIjKLQK-mzv7bNZkn70nSbSyJ",
      "name": "New Foldersa",
      "type": "folder",
      "fullPath": "/New Foldersa",
      "parentId": null,
      "metadata": null,
      "accountId": "1ffa90d9-840c-471b-97b6-4b0f5657d674",
      "deleted": false,
      "createdAt": "2025-05-23T10:18:41.674Z",
      "updatedAt": "2025-05-23T10:18:41.688Z"
    }
  }
}
```

### Create Subfolder

Creates a new subfolder within an existing folder.

**Endpoint:** `POST /api/v2/files/create/folder/{parentFolderId}`

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `resourceType=FOLDER`

**Request Body:**
```json
{
    "folderName": "New folder 10"
}
```

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v2/files/create/folder/18gXRCd8mIjKLQK-mzv7bNZkn70nSbSyJ?resourceType=FOLDER' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "folderName": "sub folder"
}'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Folder created successfully",
  "data": {
    "folder": {
      "id": "1qVlVapQTFJMm1lihOTCqoxyrmQX3x2DW",
      "name": "sub folder",
      "type": "folder",
      "fullPath": "/New Foldersa/sub folder",
      "parentId": "18gXRCd8mIjKLQK-mzv7bNZkn70nSbSyJ",
      "metadata": null,
      "accountId": "3606ff13-e451-4501-bec4-43b0b1479c13",
      "deleted": false,
      "createdAt": "2025-05-25T14:57:13.622Z",
      "updatedAt": "2025-05-25T14:57:13.646Z"
    }
  }
}
```

### Upload File to Root

Uploads a file to the root directory.

**Endpoint:** `POST /api/v2/files/upload/file`

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `resourceType=FILE`

**Request Body:** (multipart/form-data)
- `file`: The file to upload

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v2/files/upload/file?resourceType=FILE' \
--header 'Authorization: Bearer <token>' \
--form 'file=@"path/to/your/file.png"'
```

**Response (200 OK):**
```json
{
  "message": "File uploaded to remote server directly from memory",
  "file": {
    "id": "1Gv0TN-0hz97ivmUa5J40O9ZSh34FAjjR",
    "fileName": "Screenshot from 2024-10-14 12-02-47.png",
    "fileType": "image/png",
    "fileSize": 435086,
    "filePath": "/Screenshot from 2024-10-14 12-02-47.png",
    "encoding": "7bit",
    "deleted": false,
    "webContentLink": "https://drive.google.com/uc?id=1Gv0TN-0hz97ivmUa5J40O9ZSh34FAjjR&export=download",
    "webViewLink": "https://drive.google.com/file/d/1Gv0TN-0hz97ivmUa5J40O9ZSh34FAjjR/view?usp=drivesdk",
    "version": 1,
    "metadata": null,
    "folderId": null,
    "accountId": "b999cac7-7b22-4280-a795-bdb0f87aae87",
    "uploadedAt": "2025-05-23T19:44:16.300Z",
    "updatedAt": "2025-05-23T19:44:16.325Z"
  }
}
```

### Upload File to Folder

Uploads a file to a specific folder.

**Endpoint:** `POST /api/v2/files/upload/file/{folderId}`

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `resourceType=FILE`

**Request Body:** (multipart/form-data)
- `file`: The file to upload

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v2/files/upload/file/18gXRCd8mIjKLQK-mzv7bNZkn70nSbSyJ?resourceType=FILE' \
--header 'Authorization: Bearer <token>' \
--form 'file=@"path/to/your/file.png"'
```

**Response (200 OK):**
```json
{
  "message": "File uploaded to remote server directly from memory"
}
```

### Get Folders

Retrieves all folders accessible to the authenticated user.

**Endpoint:** `GET /api/v2/files/folders`

**Headers:**
- `Authorization: Bearer <token>`

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v2/files/folders' \
--header 'Authorization: Bearer <token>'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "1SNpDeIB9WtD8zqYS37xIyhCWbwS-yy5Y",
      "name": "Java Files",
      "type": "folder",
      "fullPath": "/Java Files",
      "parentId": null,
      "metadata": null,
      "accountId": "1664b533-0fb0-4a08-8077-1be5cc6d699d",
      "deleted": false,
      "createdAt": "2025-05-23T16:04:02.497Z",
      "updatedAt": "2025-05-23T16:04:02.502Z"
    },
    {
      "id": "1_ZUU1-LoI_tY6aU0JowvdzRCoQt8LvWN",
      "name": "Telepathic Files",
      "type": "folder",
      "fullPath": "/Telepathic Files",
      "parentId": null,
      "metadata": null,
      "accountId": "1664b533-0fb0-4a08-8077-1be5cc6d699d",
      "deleted": false,
      "createdAt": "2025-05-23T16:27:02.432Z",
      "updatedAt": "2025-05-23T16:27:02.436Z"
    }
  ],
  "meta": {
    "total": 4,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Get Folder by ID

Retrieves a specific folder with its contents (files and subfolders).

**Endpoint:** `GET /api/v2/files/folders/{folderId}`

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `resourceType=FOLDER`

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v2/files/folders/{folderId}?resourceType=FOLDER' \
--header 'Authorization: Bearer <token>'
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "18gXRCd8mIjKLQK-mzv7bNZkn70nSbSyJ",
    "name": "New Foldersa",
    "type": "folder",
    "fullPath": "/New Foldersa",
    "parentId": null,
    "metadata": null,
    "accountId": "1ffa90d9-840c-471b-97b6-4b0f5657d674",
    "deleted": false,
    "createdAt": "2025-05-23T10:18:41.674Z",
    "updatedAt": "2025-05-23T10:18:41.688Z",
    "files": [
      {
        "id": "1qGJ5VEaXlFYS0MkQ23OdTRBEyWi0griu",
        "fileName": "Screenshot from 2024-10-14 12-02-47.png",
        "fileType": "image/png",
        "fileSize": 435086,
        "filePath": "/New Foldersa/Screenshot from 2024-10-14 12-02-47.png",
        "encoding": "7bit",
        "deleted": false,
        "webContentLink": "https://drive.google.com/uc?id=1qGJ5VEaXlFYS0MkQ23OdTRBEyWi0griu&export=download",
        "webViewLink": "https://drive.google.com/file/d/1qGJ5VEaXlFYS0MkQ23OdTRBEyWi0griu/view?usp=drivesdk",
        "version": 1,
        "metadata": null,
        "folderId": "18gXRCd8mIjKLQK-mzv7bNZkn70nSbSyJ",
        "accountId": "b999cac7-7b22-4280-a795-bdb0f87aae87",
        "uploadedAt": "2025-05-23T10:27:04.743Z",
        "updatedAt": "2025-05-23T10:27:04.771Z"
      }
    ],
    "children": []
  }
}
```

### Get File by ID

Retrieves information about a specific file.

**Endpoint:** `GET /api/v2/files/{fileId}`

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `resourceType=FILE`

**Example Request:**
```bash
curl --location 'https://api.yareyare.com/api/v2/files/{fileId}?resourceType=FILE' \
--header 'Authorization: Bearer <token>'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "file": {
      "id": "1Gv0TN-0hz97ivmUa5J40O9ZSh34FAjjR",
      "fileName": "Screenshot from 2024-10-14 12-02-47.png",
      "fileType": "image/png",
      "fileSize": 435086,
      "filePath": "/Screenshot from 2024-10-14 12-02-47.png",
      "encoding": "7bit",
      "deleted": false,
      "webContentLink": "https://drive.google.com/uc?id=1Gv0TN-0hz97ivmUa5J40O9ZSh34FAjjR&export=download",
      "webViewLink": "https://drive.google.com/file/d/1Gv0TN-0hz97ivmUa5J40O9ZSh34FAjjR/view?usp=drivesdk",
      "version": 1,
      "metadata": null,
      "folderId": null,
      "accountId": "b999cac7-7b22-4280-a795-bdb0f87aae87",
      "uploadedAt": "2025-05-23T19:44:16.300Z",
      "updatedAt": "2025-05-23T19:44:16.325Z"
    }
  }
}
```

### Delete File

Deletes a specific file from the system.

**Endpoint:** `DELETE /api/v2/files/file/{fileId}`

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `resourceType=FILE`

**Example Request:**
```bash
curl --location --request DELETE 'https://api.yareyare.com/api/v2/files/file/{fileId}?resourceType=FILE' \
--header 'Authorization: Bearer <token>'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "File deleted successfully"
}
```

### Upload Folders

Endpoint for uploading multiple folders (batch operation).

**Endpoint:** `POST /api/v2/files/upload/folder`

**Headers:**
- `Authorization: Bearer <token>`

**Example Request:**
```bash
curl --location 'http://localhost:3004/api/v2/files/upload/folder' \
--header 'Authorization: Bearer <token>'
```

---

## Trash Management

### Get All Trash

Retrieves all deleted items from the trash.

**Endpoint:** `GET /api/v1/trash`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{ 
    "type": "FILE", // or FOLDER
    "itemId": ""
}
```

**Example Request:**
```bash
curl --location --request GET 'https://api.yareyare.com/api/v1/trash' \
--header 'Authorization: Bearer <token>' \
--data '{ 
    "type": "FILE",
    "itemId": ""
}'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "1322ef70-6780-4a17-a2f7-ca32824d5dc5",
      "accountId": "266b9ef5-8b74-4d96-91c9-9a82dd32dea5",
      "folderId": null,
      "fileId": "1CDEv32Omg7jR-YperBLST2B7Bkqij7EE",
      "deletedAt": "2025-07-07T16:49:22.904Z",
      "originalPath": null,
      "itemType": "FILE",
      "retentionExpiresAt": null,
      "deletedBy": {
        "id": "266b9ef5-8b74-4d96-91c9-9a82dd32dea5",
        "fullName": "Marta Boehm",
        "email": "iammoses19@gmail.com",
        "phoneNumber": null,
        "role": "ADMIN",
        "createdAt": "2025-07-07T16:36:13.370Z",
        "updatedAt": "2025-07-07T16:36:13.370Z"
      }
    }
  ]
}
```

### Get Trash Analysis

Retrieves analytics data for the trash.

**Endpoint:** `GET /api/v1/trash/analysis`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{ 
    "type": "FILE", // or FOLDER
    "itemId": ""
}
```

**Example Request:**
```bash
curl --location --request GET 'https://api.yareyare.com/api/v1/trash/analysis' \
--header 'Authorization: Bearer <token>' \
--data '{ 
    "type": "FILE",
    "itemId": ""
}'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "totalItems": 1,
    "freedSpace": 420
  }
}
```

### Restore Deleted Item

Restores a deleted item from the trash.

**Endpoint:** `PUT /api/v1/trash/restore/{trashId}`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{   
    "type": "FILE",
    "itemId": "{{fileIdOrFolderId}}"
}
```

**Example Request:**
```bash
curl --location -g --request PUT 'https://api.yareyare.com/api/v1/trash/restore/{{trashId}}' \
--header 'Authorization: Bearer <token>' \
--data '{   
    "type": "FILE",
    "itemId": "{{fileIdOrFolderId}}"
}'
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "restoredItem": {
      "id": "1CDEv32Omg7jR-YperBLST2B7Bkqij7EE",
      "fileName": "error.ts",
      "fileType": "video/mp2t",
      "fileSize": 420,
      "filePath": "/error.ts",
      "encoding": "7bit",
      "deleted": false,
      "webContentLink": "https://drive.google.com/uc?id=1CDEv32Omg7jR-YperBLST2B7Bkqij7EE&export=download",
      "webViewLink": "https://drive.google.com/file/d/1CDEv32Omg7jR-YperBLST2B7Bkqij7EE/view?usp=drivesdk",
      "version": 1,
      "metadata": null,
      "folderId": null,
      "accountId": "b734e0bf-306a-4ef0-90ef-9d57e044d68d",
      "uploadedAt": "2025-07-07T16:36:41.030Z",
      "updatedAt": "2025-07-24T02:56:49.187Z"
    }
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Insufficient permissions to access this resource"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## API Base URLs

- **Production:** `https://api.yareyare.com`
- **Development:** `http://localhost:3004`
- **Azure Instance:** `http://20.80.82.90:3000`
  - `/api/v1` - Authentication, user management, and audit logs
  - `/api/v2` - File and folder operations

## Authentication

Most endpoints require authentication via Bearer token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained through the login endpoint and have a limited lifetime. Refresh tokens as needed.

## Rate Limiting

API requests are subject to rate limiting. Current limits:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Versioning

The API uses versioning in the URL path:
- `/api/v1/` - Authentication and user management
- `/api/v2/` - Files and folders management
