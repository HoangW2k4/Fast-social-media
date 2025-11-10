import { Badge, IconButton } from '@mui/material';

function Icon({ IconName, size = 28, color = 'var(--primary)', badge = 0, badgeColor = 'error', onClick }) {
    return (
        <IconButton onClick={onClick}>
            {badge > 0 ? (
                <Badge badgeContent={badge} color={badgeColor}>
                    <IconName sx={{ fontSize: size, color: color }} />
                </Badge>
            ) : (
                <IconName sx={{ fontSize: size, color: color }} />
            )}
        </IconButton>
    );
}

export default Icon;