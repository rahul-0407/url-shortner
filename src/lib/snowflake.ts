import { encode } from "./base62";

const EPOCH = 1704067200000n;

const WORKED_ID_BITS = 10n;
const SEQUENCE_BITS = 12n;

const MAX_WORKER_ID = (1n << WORKED_ID_BITS) - 1n;
const MAX_SEQUENCE = (1n << SEQUENCE_BITS) - 1n;

const WORKER_ID_SHIFT = SEQUENCE_BITS;
const TIMESTAMP_SHIFT = SEQUENCE_BITS + WORKED_ID_BITS;

export class Snowflake {
    private readonly workerId: bigint;
    private sequence = 0n;
    private lastTimestamp = -1n;

    constructor(workedId: number){
        const id = BigInt(workedId);
        if(id < 0n || id > MAX_WORKER_ID){
            throw new Error(`workerId must be between 0 and ${MAX_WORKER_ID}`)
        }
        this.workerId = id;
    }

    nextId(): bigint {
        let timestamp = this.currentTimeMs();

        if(timestamp < this.lastTimestamp){
            throw new Error("Clock moved backwards, refusing to generate id");
        }

        if(timestamp == this.lastTimestamp){
            this.sequence = (this.sequence + 1n) & MAX_SEQUENCE;
            if(this.sequence === 0n){
                timestamp = this.waitNextMillis(this.lastTimestamp)
            }
        } else {
            this.sequence = 0n;
        }

        this.lastTimestamp = timestamp;

        const id = ((timestamp - EPOCH) << TIMESTAMP_SHIFT) | (this.workerId << WORKER_ID_SHIFT) | this.sequence;

        return id;
    }

    nextShortCode(): string {
        return encode(this.nextId());
    }

    private currentTimeMs(): bigint{
        return BigInt(Date.now());
    }

    private waitNextMillis(last: bigint): bigint {
        let timestamp = this.currentTimeMs();
        while(timestamp <= last) {
            timestamp = this.currentTimeMs();
        }
        return timestamp;
    }
}

