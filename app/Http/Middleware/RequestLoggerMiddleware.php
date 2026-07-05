<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequestLoggerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        \Log::info('Incoming Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'payload' => $request->all()
        ]);

        return $next($request);
    }
}
