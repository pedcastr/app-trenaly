export const getAvatarUrl = (userData, user) => {
  // Se tem foto de perfil no userData, usar ela
  if (userData?.photoURL) {
    return userData.photoURL;
  }
  
  // Se tem foto de perfil no user do Firebase Auth, usar ela
  if (user?.photoURL) {
    return user.photoURL;
  }
  
  // Se não tem, gerar avatar com iniciais
  const nome = userData?.displayName || userData?.nome || userData?.nomePreferido || user?.displayName || user?.email || 'Usuario';
  const initials = nome
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  return `https://ui-avatars.com/api/?name=${initials}&background=276999&color=fff&size=200`;
};

export const getAvatarUrlSync = (userData, user) => {
  // Se tem foto de perfil no userData, usar ela
  if (userData?.photoURL) {
    return userData.photoURL;
  }
  
  // Se tem foto de perfil no user do Firebase Auth, usar ela
  if (user?.photoURL) {
    return user.photoURL;
  }
  
  // Se não tem, gerar avatar com iniciais
  const nome = userData?.displayName || userData?.nome || userData?.nomePreferido || user?.displayName || user?.email || 'Usuario';
  const initials = nome
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  return `https://ui-avatars.com/api/?name=${initials}&background=276999&color=fff&size=200`;
};

export const getUserDisplayName = (userData, user) => {
  return userData?.displayName || userData?.nome || userData?.nomePreferido || user?.displayName || user?.email?.split('@')[0] || 'Usuário';
};
