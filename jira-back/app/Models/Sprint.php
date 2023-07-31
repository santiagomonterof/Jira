<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    use HasFactory;
    protected $fillable = [
        "order",
        "start_date",
        "end_date",
        "status",
        "project_id",
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    public function project()
    {
        return $this->belongsTo(Project::class, "project_id");
    }
    public function stories()
    {
        return $this->belongsToMany(Story::class, "sprint_stories", "sprint_id", "story_id");
    }
}
