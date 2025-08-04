function atualizarPerfilDiscord(userId) {
    const targetUserId = userId || '1250093055457886209';

    fetch(`https://api.lanyard.rest/v1/users/${targetUserId}`)
    .then(response => response.json())
    .then(result => {
        const data = result.data;
        if (!data) return;

        const avatarImg = document.querySelector('.avatarImage');
        if (avatarImg && data.discord_user?.avatar) {
            const avatarHash = data.discord_user.avatar;
            const userId = data.discord_user.id;
            const isGif = avatarHash.startsWith('a_');
            const format = isGif ? 'gif' : 'png';
            const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${format}?t=${Date.now()}`;

            avatarImg.src = avatarUrl;
        }

        const statusImg = document.querySelector('.discordStatus');
        if (statusImg) {
            const status = data.discord_status;
            switch(status) {
                case 'online': statusImg.src = '/img/online.png'; break;
                case 'idle': statusImg.src = '/img/idle.png'; break;
                case 'dnd': statusImg.src = '/img/dnd.png'; break;
                default: statusImg.src = '/img/offline.png';
            }
        }

        const usernameElement = document.querySelector('.username');
        if (usernameElement && data.discord_user?.username) {
            usernameElement.textContent = data.discord_user.username;
        }
    })
    .catch(error => {
        const statusElement = document.querySelector('.status-debugging');
        if (statusElement) {
            statusElement.textContent = 'Connection error: ' + error.message;
            statusElement.style.color = 'red';
        }
    });
}

function determinarUsuarioPagina() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('meuperfil') || currentPath.includes('perfil2')) {
        return '1250093055457886209';
    }
    return '1250093055457886209';
}

document.addEventListener('DOMContentLoaded', function() {
    const avatarImg = document.querySelector('.avatarImage');
    if (avatarImg) {
        avatarImg.src = '';
    }

    const userId = determinarUsuarioPagina();
    atualizarPerfilDiscord(userId);
    setInterval(() => atualizarPerfilDiscord(userId), 5000);
});

const avatarImg = document.querySelector('.avatarImage');
if (avatarImg) {
    avatarImg.addEventListener('click', function() {
        const userId = determinarUsuarioPagina();
        atualizarPerfilDiscord(userId);
    });
}