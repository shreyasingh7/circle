"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const sassMiddleware = require("node-sass-middleware");
const common_1 = require("@nestjs/common");
const config = require("config");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = new common_1.Logger('bootstrap');
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.useStaticAssets(path_1.join(__dirname, '..', 'public'));
        app.setBaseViewsDir(path_1.join(__dirname, '..', 'views'));
        app.setViewEngine('hbs');
        const serverConfig = config.get('server');
        app.use(sassMiddleware({
            src: __dirname + '/scss',
            dest: __dirname + '/public',
            debug: true,
        }));
        if (process.env.NODE_ENV === 'development') {
            app.enableCors();
        }
        else {
            app.enableCors({ origin: serverConfig.origin });
            logger.log(`Accepting requests from origin "${serverConfig}"`);
        }
        const port = process.env.PORT || serverConfig.port;
        yield app.listen(port);
        logger.log(`Application listeniung to port ${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map