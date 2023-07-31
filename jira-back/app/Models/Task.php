<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "status",
        "story_id",
        "order",
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function story()
    {
        return $this->belongsTo(Story::class, "story_id");
    }

}
