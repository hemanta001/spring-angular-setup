
export {FileUrl, User, Role};

interface FileUrl {
  fileUrl?: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  address?: string;
  mobileNumber: string;
  selfieUrl?: string;
  email: string;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
}


