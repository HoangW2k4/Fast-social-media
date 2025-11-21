import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logout from "@mui/icons-material/Logout";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Settings from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import classNames from "classnames/bind";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../../../context/AuthContext";
import Icon from "./Icon";
import styles from "./ManagerHeader.module.scss";

const avatarSrc = require("../../../../assets/avatar.jpg");

const cx = classNames.bind(styles);

function ManagerHeader() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={cx("wrapper")}>
      <div className={cx("header-text")}>
        <h2 className={cx("title")}>Dashboard tổng quan</h2>
        <p className={cx("description")}>Chào mừng bạn quay trở lại!</p>
      </div>
      <div className={cx("actions")}>
        <div className={cx("search")}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className={cx("input")}
          />
          <button className={cx("search-btn")}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={cx("search-icon")}
            />
          </button>
        </div>
        <div className={cx("action-btn")}>
          <Icon IconName={NotificationsNoneIcon} badge={4} />
        </div>
        <div className={cx("action-btn")}>
          <Icon IconName={MailOutlineIcon} badge={2} />
        </div>

        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 36, height: 36 }} src={avatarSrc} />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar src={avatarSrc} /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Avatar src={avatarSrc} /> My account
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
}

export default ManagerHeader;
