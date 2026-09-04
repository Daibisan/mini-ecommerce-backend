import express from "express";
import { login, register } from "./auth.controller.js";

export const auth_router = express.Router();

/**
 * @openapi
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *                  example: "Budi Haryanto"
 *              email:
 *                  type: string
 *                  example: "Budi@gmail.com"
 *      AuthResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *                  example: true
 *              data:
 *                  type: object
 *                  properties:
 *                      token: 
 *                          type: string
 *                          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                      user:
 *                          $ref: '#/components/schemas/User'
 *      ErrorResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *                  example: false
 *              error:
 *                  type: string
 *                  example: "Internal server error"
 */

/**
 * @openapi
 * /api/auth/register:
 *  post:
 *      tags: [Auth]
 *      summary: Register a new user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: [username, email, password]
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: "Budi Haryanto"
 *                          email:
 *                              type: string
 *                              example: "Budi@gmail.com"
 *                          password:
 *                              type: string
 *                              example: "12345678Budi.!"
 *      responses:
 *          201:
 *              description: User registration success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AuthResponse'
 *          400:
 *              description: Bad Request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          success: false
 *                          message: "Email is not valid"
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          success: false
 *                          message: "Unauthorized"
 *          409:
 *              description: Username/Email already in use
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          success: false
 *                          message: "Email already in use"
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          success: false
 *                          message: "Internal Server Error"
 *              
 */
auth_router.post("/register", register);

/**
 * @openapi
 * /api/auth/login:
 *  post:
 *      tags: [Auth]
 *      summary: Login user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: [identifier, password]
 *                      properties:
 *                          identifier:
 *                              type: string
 *                              description: Username or email
 *                              example: "Budi Haryanto"
 *                          password:
 *                              type: string
 *                              example: "12345678Budi.!"
 *      responses:
 *          200:
 *              description: Login success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AuthResponse'
 *          400:
 *              description: Bad Request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          success: false
 *                          message: "Email is not valid"
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          success: false
 *                          message: "Invalid login credentials"
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          success: false
 *                          message: "Internal Server Error"
 *              
 */
auth_router.post("/login", login);
