import Swal from 'sweetalert2';

export const handleLogout = (logout, dispatch, navigate) => {
  Swal.fire({
    title: "¿Deseas cerrar sesión?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    confirmButtonColor: '#002E5D',
    iconColor: '#c9dae1'
  }).then((result) => {
    if (result.isConfirmed) {
      logout()
        .then(() => {
          dispatch({ type: 'SIGNOUT' }); 
          navigate('/', { replace: true });
          Swal.fire({
            title: '¡Sesión cerrada!',
            text: 'Has cerrado sesión correctamente',
            icon: 'success',
            confirmButtonColor: '#002E5D'
          });
        })
        .catch(error => {
          console.error('Error al cerrar sesión:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar cerrar sesión. Intenta más tarde.',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        });
    }
  });
};