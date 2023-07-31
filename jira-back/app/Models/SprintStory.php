<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SprintStory extends Model
{
    use HasFactory;

    protected $fillable = [
        "sprint_id",
        "story_id",
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class, "sprint_id");
    }

    public function story()
    {
        return $this->belongsTo(Story::class, "story_id");
    }

}
