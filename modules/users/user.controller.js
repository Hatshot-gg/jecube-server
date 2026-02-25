const { setRefreshCookie, clearRefreshCookie } = require("../../utils/cookies");
const userService = require("./user.service");

class UserController {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await userService.register(email, password);

      setRefreshCookie(res, data.refreshToken);
      res.json({ accessToken: data.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await userService.login(email, password);

      setRefreshCookie(res, data.refreshToken);
      res.json({ accessToken: data.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const data = await userService.refresh(refreshToken);

      setRefreshCookie(res, data.refreshToken);
      res.json({ accessToken: data.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await userService.logout(refreshToken);

      clearRefreshCookie(res);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const data = await userService.getUser(req.user.id);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
