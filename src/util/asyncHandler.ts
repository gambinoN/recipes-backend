import {NextFunction, Request, Response} from 'express';

export function asyncController<C>(controller: C) {
    return function <H extends keyof C>(handler: H) {
        const handlerFn = controller[handler] as (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
        return (req: Request, res: Response, next: NextFunction) => {
            handlerFn
                .call(controller, req, res, next)
                .catch(err => next(err));
        };
    };
}