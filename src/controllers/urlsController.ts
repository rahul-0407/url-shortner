import type { Request, Response } from "express";
import { env } from "../config/env";

export async function createUrl(req: Request, res: Response): Promise<void> {}

export async function listUrls(req: Request, res: Response): Promise<void> {}

export async function getUrl(req: Request, res: Response): Promise<void> {}

export async function deleteUrl(req: Request, res: Response): Promise<void> {}

export async function getStats(req: Request, res: Response): Promise<void> {}